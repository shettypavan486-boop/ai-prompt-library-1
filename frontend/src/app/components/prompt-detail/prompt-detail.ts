import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prompt-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './prompt-detail.html',
  styleUrl: './prompt-detail.css'
})
export class PromptDetailComponent implements OnInit {
  prompt: any = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('Route ID:', id);

    if (!id) {
      this.error = 'Prompt ID not found.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/prompts/${id}/`);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      console.log('Prompt detail loaded:', data);

      this.prompt = data;
    } catch (err) {
      console.error('Prompt detail error:', err);
      this.error = 'Prompt not found or failed to load.';
    } finally {
      this.loading = false;

      // 🔥 FORCE UI UPDATE
      this.cdr.detectChanges();
    }
  }
}