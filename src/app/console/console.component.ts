import {Component, Input, OnInit} from '@angular/core';
import {LogMessage} from './log-message';


@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.css']
})
export class ConsoleComponent implements OnInit {

  @Input() logs: LogMessage[];

  constructor() {
    this.logs = [];
  }

  ngOnInit() {}
}
