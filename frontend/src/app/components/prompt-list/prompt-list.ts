import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PromptService, Prompt } from '../../services/prompt';

@Component({
  selector: 'app-prompt-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './prompt-list.html',
  styleUrl: './prompt-list.css'
})
export class PromptListComponent implements OnInit {
  prompts: Prompt[] = [];
  loading = true;
  error = '';

  constructor(private promptService: PromptService) {}

  ngOnInit(): void {
    this.promptService.getPrompts().subscribe({
      next: (data) => {
        console.log('Prompts loaded:', data);
        this.prompts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading prompts:', err);
        this.error = 'Failed to load prompts.';
        this.loading = false;
      }
    });
  }

  getComplexityClass(complexity: number): string {
    if (complexity <= 3) return 'low';
    if (complexity <= 7) return 'medium';
    return 'high';
  }
}
