import { Component, OnInit } from '@angular/core';
import { FiltersService } from '../../_core/services/filters.service';

@Component({
  selector: 'top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss']
})
export class TopBarComponent implements OnInit {

  constructor(private filtersService: FiltersService) { }

  ngOnInit() {
  }
  
  setPages = (page) => this.filtersService.setPages(page);

}
