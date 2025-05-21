import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InventoryService, InventoryItem } from '../../services/inventory.service';

// Local storage items for in-memory mode
interface LocalInventoryItem {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css'
})
export class InventoryComponent implements OnInit, AfterViewInit {
  @ViewChild('dbToggle') dbToggleElement!: ElementRef;
  
  inventoryItems: InventoryItem[] = [];
  localInventoryItems: LocalInventoryItem[] = [];
  isLoading = true;
  errorMessage = '';
  useSqliteDb = true;

  newItem: Omit<InventoryItem, 'id'> = {
    name: '',
    description: '',
    quantity: 0,
    price: 0
  };

  isEditing = false;
  editingItem: InventoryItem | null = null;

  constructor(private inventoryService: InventoryService) {}

  ngOnInit(): void {
    // Load local storage items
    const storedItems = localStorage.getItem('inventoryItems');
    if (storedItems) {
      this.localInventoryItems = JSON.parse(storedItems);
    } else {
      // Initialize with default items if empty
      this.localInventoryItems = [
        { id: 1, name: 'Laptop', description: 'High-performance laptop', quantity: 10, price: 1200 },
        { id: 2, name: 'Smartphone', description: 'Latest model smartphone', quantity: 15, price: 800 },
        { id: 3, name: 'Headphones', description: 'Noise-cancelling headphones', quantity: 20, price: 150 }
      ];
      this.saveLocalItems();
    }
    
    this.loadInventoryItems();
  }

  ngAfterViewInit(): void {
    // Add event listener to the database toggle
    const dbToggle = document.getElementById('dbToggle') as HTMLInputElement;
    if (dbToggle) {
      dbToggle.addEventListener('change', (event) => {
        this.useSqliteDb = (event.target as HTMLInputElement).checked;
        this.loadInventoryItems();
      });
    }
  }

  loadInventoryItems(): void {
    if (this.useSqliteDb) {
      // Load from SQLite database
      this.isLoading = true;
      this.inventoryService.getInventoryItems().subscribe({
        next: (items) => {
          this.inventoryItems = items;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error fetching inventory items', error);
          this.errorMessage = 'Failed to load inventory items from database. Switching to local storage.';
          this.isLoading = false;
          
          // Fall back to local storage if database fails
          this.useSqliteDb = false;
          const dbToggle = document.getElementById('dbToggle') as HTMLInputElement;
          if (dbToggle) {
            dbToggle.checked = false;
          }
          this.inventoryItems = [...this.localInventoryItems];
        }
      });
    } else {
      // Use local storage
      this.isLoading = true;
      setTimeout(() => {
        this.inventoryItems = [...this.localInventoryItems];
        this.isLoading = false;
      }, 300); // Simulate a small delay for loading effect
    }
  }

  saveLocalItems(): void {
    localStorage.setItem('inventoryItems', JSON.stringify(this.localInventoryItems));
  }

  addItem(): void {
    if (this.newItem.name && this.newItem.quantity > 0) {
      if (this.useSqliteDb) {
        // Add to SQLite database
        this.inventoryService.addInventoryItem(this.newItem).subscribe({
          next: (item) => {
            this.inventoryItems.push(item);
            // Reset the form
            this.newItem = {
              name: '',
              description: '',
              quantity: 0,
              price: 0
            };
          },
          error: (error) => {
            console.error('Error adding inventory item', error);
            this.errorMessage = 'Failed to add inventory item to database. Please try again.';
          }
        });
      } else {
        // Add to local storage
        const newId = this.localInventoryItems.length > 0 
          ? Math.max(...this.localInventoryItems.map(item => item.id)) + 1 
          : 1;
        
        const newLocalItem: LocalInventoryItem = {
          id: newId,
          name: this.newItem.name,
          description: this.newItem.description || '',
          quantity: this.newItem.quantity,
          price: this.newItem.price
        };
        
        this.localInventoryItems.push(newLocalItem);
        this.inventoryItems.push(newLocalItem);
        this.saveLocalItems();
        
        // Reset the form
        this.newItem = {
          name: '',
          description: '',
          quantity: 0,
          price: 0
        };
      }
    }
  }

  startEdit(item: InventoryItem): void {
    this.isEditing = true;
    this.editingItem = { ...item };
  }

  saveEdit(): void {
    if (this.editingItem) {
      if (this.useSqliteDb) {
        // Update in SQLite database
        this.inventoryService.updateInventoryItem(this.editingItem).subscribe({
          next: (updatedItem) => {
            const index = this.inventoryItems.findIndex(item => item.id === updatedItem.id);
            if (index !== -1) {
              this.inventoryItems[index] = updatedItem;
            }
            this.cancelEdit();
          },
          error: (error) => {
            console.error('Error updating inventory item', error);
            this.errorMessage = 'Failed to update inventory item in database. Please try again.';
          }
        });
      } else {
        // Update in local storage
        const index = this.localInventoryItems.findIndex(item => item.id === this.editingItem!.id);
        if (index !== -1) {
          this.localInventoryItems[index] = { ...this.editingItem as LocalInventoryItem };
          this.inventoryItems[index] = { ...this.editingItem };
          this.saveLocalItems();
        }
        this.cancelEdit();
      }
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editingItem = null;
  }

  deleteItem(id: number): void {
    if (this.useSqliteDb) {
      // Delete from SQLite database
      this.inventoryService.deleteInventoryItem(id).subscribe({
        next: () => {
          this.inventoryItems = this.inventoryItems.filter(item => item.id !== id);
        },
        error: (error) => {
          console.error('Error deleting inventory item', error);
          this.errorMessage = 'Failed to delete inventory item from database. Please try again.';
        }
      });
    } else {
      // Delete from local storage
      this.localInventoryItems = this.localInventoryItems.filter(item => item.id !== id);
      this.inventoryItems = this.inventoryItems.filter(item => item.id !== id);
      this.saveLocalItems();
    }
  }
}