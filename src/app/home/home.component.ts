import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestConnectService } from './rest-connect.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchForm: FormGroup;
  answer: string = '';
  formattedAnswer: SafeHtml = '';
  contexts: string[] = ['Context 1', 'Context 2', 'Context 3'];
  selectedContext: string = '';

  constructor(
    private fb: FormBuilder, 
    private restConnectService: RestConnectService,
    private sanitizer: DomSanitizer
  ) {
    this.searchForm = this.fb.group({
      query: '',
      selectedContext: ''
    });
  }

  ngOnInit(): void {}

  onSearch(event?: Event) {
    if (event) {
      event.preventDefault();
    }

    const query = this.searchForm.get('query')?.value.trim();
    const selectedContext = this.selectedContext;

    if (query) {
      this.restConnectService.search(query, selectedContext).subscribe(
        response => {
          const answerStartIndex = response.answer.indexOf('Answer: ');
          if (answerStartIndex !== -1) {
            this.answer = response.answer.substring(answerStartIndex + 'Answer: '.length);
            this.formattedAnswer = this.formatAnswer(this.answer);
          } else {
            this.answer = '';
            this.formattedAnswer = '';
          }
        },
        error => {
          console.error('Error fetching data:', error);
        }
      );
    }
  }

  formatAnswer(answer: string): SafeHtml {
    // Convert numbered lists
    answer = answer.replace(/^\d+\.\s/gm, '<li>');
    
    // Convert bullet points
    answer = answer.replace(/^[-*]\s/gm, '<li>');
    
    // Wrap list items in <ul> or <ol> tags
    answer = answer.replace(/<li>.*(?=(\n<li>|$))/gs, (match, p1, offset, string) => {
      if (string.charAt(offset - 1) === '.') {
        return `<ol>${match}</ol>`;
      }
      return `<ul>${match}</ul>`;
    });
    
    // Close list items
    answer = answer.replace(/<li>(.*?)(?=<li>|<\/[uo]l>|$)/g, '<li>$1</li>');
    
    // Convert newlines to <br> tags for non-list content
    answer = answer.replace(/\n(?!<\/?[uo]l>|<li>)/g, '<br>');

    return this.sanitizer.bypassSecurityTrustHtml(answer);
  }
}