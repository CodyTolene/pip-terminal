import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'pip-map-page',
  templateUrl: './map-page.component.html',
  imports: [CommonModule, GoogleMapsModule],
  styleUrl: './map-page.component.scss',
  providers: [],
  standalone: true,
})
export class MapPageComponent implements OnInit {
  public constructor(private readonly mapService: MapService) {}

  protected options: google.maps.MapOptions | null = null;

  protected readonly isProduction = environment.isProduction;

  public async ngOnInit(): Promise<void> {
    if (!this.isProduction) {
      return;
    }

    await this.mapService.initialize();

    this.options = {
      // center: { lat: 36.114647, lng: -115.172813 }, // Las Vegas, NV
      center: { lat: 35.9981, lng: -115.572 }, // Goodsprings, NV
      zoom: 12,
      disableDefaultUI: true,
      styles: [
        { elementType: 'geometry', stylers: [{ color: '#0f3315' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#33ff33' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#001100' }] },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#004400' }],
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#115522' }],
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{ color: '#0f3315' }],
        },
      ],
    };
  }
}
