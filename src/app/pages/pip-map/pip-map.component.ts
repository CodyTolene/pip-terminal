import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

import { PipMapService } from 'src/app/services/pip-map.service';

@Component({
  selector: 'pip-map',
  templateUrl: './pip-map.component.html',
  imports: [CommonModule, GoogleMapsModule],
  styleUrl: './pip-map.component.scss',
  providers: [],
  standalone: true,
})
export class PipMapComponent implements OnInit {
  public constructor(private readonly pipMapService: PipMapService) {}

  public options: google.maps.MapOptions | null = null;

  public async ngOnInit(): Promise<void> {
    await this.pipMapService.load();

    this.options = {
      center: { lat: 36.114647, lng: -115.172813 }, // Las Vegas, NV
      // center: { lat: 35.9981, lng: -115.572 }, // Goodsprings, NV
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
