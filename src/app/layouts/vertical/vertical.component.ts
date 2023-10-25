import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {TopbarComponent} from "../topbar/topbar.component";
import {SidebarComponent} from "../sidebar/sidebar.component";
import {FooterComponent} from "../footer/footer.component";
import { DATA_PRELOADER, LAYOUT, LAYOUT_MODE, LAYOUT_POSITION, LAYOUT_WIDTH, SIDEBAR_COLOR, SIDEBAR_IMAGE, SIDEBAR_VIEW, SIDEBAR_VISIBILITY, TOPBAR } from '../layout';
import {EventService} from "../../core/services/event.service";

@Component({
  selector: 'app-vertical',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarComponent, FooterComponent],
  templateUrl: './vertical.component.html',
  styleUrls: ['./vertical.component.scss']
})
export class VerticalComponent {
  isCondensed = false;

  constructor(private eventService: EventService) { }

  ngOnInit(): void {
    if (document.documentElement.getAttribute('data-layout') == 'semibox') {
      document.documentElement.setAttribute('data-layout', 'semibox');
    } else {
      document.documentElement.setAttribute('data-layout', LAYOUT);
    }
    document.documentElement.setAttribute('data-topbar', TOPBAR);
    document.documentElement.setAttribute('data-sidebar', SIDEBAR_COLOR);
    document.documentElement.setAttribute('data-layout-style', SIDEBAR_VIEW);
    document.documentElement.setAttribute('data-bs-theme', LAYOUT_MODE);
    document.documentElement.setAttribute('data-layout-width', LAYOUT_WIDTH);
    document.documentElement.setAttribute('data-layout-position', LAYOUT_POSITION);
    document.documentElement.setAttribute('data-sidebar-image', SIDEBAR_IMAGE);
    document.documentElement.setAttribute('data-preloader', DATA_PRELOADER);
    document.documentElement.setAttribute('data-sidebar-visibility', SIDEBAR_VISIBILITY);

    window.addEventListener('resize', function () {
      if (document.documentElement.clientWidth <= 767) {
        document.documentElement.setAttribute('data-sidebar-size', '');
        document.querySelector('.hamburger-icon')?.classList.add('open')
      }
      else if (document.documentElement.clientWidth <= 1024) {
        document.documentElement.setAttribute('data-sidebar-size', 'sm');
        document.querySelector('.hamburger-icon')?.classList.add('open')
      }
      else if (document.documentElement.clientWidth >= 1024) {
        document.documentElement.setAttribute('data-sidebar-size', 'lg');
        document.querySelector('.hamburger-icon')?.classList.remove('open')
      }
    })

  }

  /**
   * On mobile toggle button clicked
   */
  onToggleMobileMenu() {
    const currentSIdebarSize = document.documentElement.getAttribute("data-sidebar-size");
    if (document.documentElement.clientWidth >= 767) {
      if (currentSIdebarSize == null) {
        (document.documentElement.getAttribute('data-sidebar-size') == null || document.documentElement.getAttribute('data-sidebar-size') == "lg") ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'lg')
      } else if (currentSIdebarSize == "md") {
        (document.documentElement.getAttribute('data-sidebar-size') == "md") ? document.documentElement.setAttribute('data-sidebar-size', 'sm') : document.documentElement.setAttribute('data-sidebar-size', 'md')
      } else {
        (document.documentElement.getAttribute('data-sidebar-size') == "sm") ? document.documentElement.setAttribute('data-sidebar-size', 'lg') : document.documentElement.setAttribute('data-sidebar-size', 'sm')
      }
    }

    if (document.documentElement.clientWidth <= 767) {
      document.body.classList.toggle('vertical-sidebar-enable');
    }
    this.isCondensed = !this.isCondensed;
  }

  /**
   * on settings button clicked from topbar
   */
  onSettingsButtonClicked() {
    document.body.classList.toggle('right-bar-enabled');
    const rightBar = document.getElementById('theme-settings-offcanvas');
    if (rightBar != null) {
      rightBar.classList.toggle('show');
      rightBar.setAttribute('style', "visibility: visible;");
    }
  }

  onResize(event: any) {
    if (document.body.getAttribute('layout') == "twocolumn") {
      console.log(document.body.getAttribute('layout'))
      if (event.target.innerWidth <= 767) {
        this.eventService.broadcast('changeLayout', 'vertical');
      } else {
        this.eventService.broadcast('changeLayout', 'twocolumn');
        document.body.classList.remove('twocolumn-panel');
        document.body.classList.remove('vertical-sidebar-enable');
      }
    }

  }

}
