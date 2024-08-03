import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RestConnectService } from './rest-connect.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchForm: FormGroup;
  answer: string = '';
  suggestions = [
    "How to implement lazy loading in Angular?",
    "Best practices for state management in React",
    "Debugging techniques for Node.js applications",
    "Optimizing database queries in PostgreSQL",
    "Creating responsive layouts with CSS Grid",
    "Implementing authentication in a REST API"
  ];

  constructor(private fb: FormBuilder, private restConnectService: RestConnectService) {
    this.searchForm = this.fb.group({
      query: ''
    });
  }

  ngOnInit(): void {}

  onSearch(event?: Event){

    if (event) {
      event.preventDefault(); // Prevent the default form submission
    }
  

    const query = this.searchForm.get('query')?.value.trim();
    if (query) {
      this.restConnectService.search(query).subscribe(
        response => {
          // Assuming response is in the format { "answer": "Answer: <actual_answer>" }
          const answerStartIndex = response.answer.indexOf('Answer: ');
          if (answerStartIndex !== -1) {
            this.answer = response.answer.substring(answerStartIndex + 'Answer: '.length);
            console.log(this.answer)
          } else {
            this.answer = ''; // Handle if 'Answer: ' is not found
          }
        },
        error => {
          console.error('Error fetching data:', error);
          // Handle error as needed
        }
      );
    }
  }


  useSuggestion(suggestion: string) {
    this.searchForm.patchValue({ query: suggestion });
    this.onSearch();
  }
}


