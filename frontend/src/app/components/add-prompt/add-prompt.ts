import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PromptService } from '../../services/prompt';

@Component({
  selector: 'app-add-prompt',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-prompt.html',
  styleUrl: './add-prompt.css'
})
export class AddPromptComponent {
  serverError = '';
  successMessage = '';

  promptForm;

  constructor(
    private fb: FormBuilder,
    private promptService: PromptService,
    private router: Router
  ) {
    this.promptForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(20)]],
      complexity: [1, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  submit() {
    this.serverError = '';
    this.successMessage = '';

    if (this.promptForm.invalid) {
      this.promptForm.markAllAsTouched();
      return;
    }

    this.promptService.createPrompt(this.promptForm.value).subscribe({
      next: () => {
        this.successMessage = 'Prompt added successfully';
        this.promptForm.reset({
          title: '',
          content: '',
          complexity: 1
        });

        setTimeout(() => {
          this.router.navigate(['/prompts']);
        }, 800);
      },
      error: (err) => {
        console.error(err);
        this.serverError = 'Failed to create prompt.';
      }
    });
  }

  get title() {
    return this.promptForm.get('title');
  }

  get content() {
    return this.promptForm.get('content');
  }

  get complexity() {
    return this.promptForm.get('complexity');
  }
}