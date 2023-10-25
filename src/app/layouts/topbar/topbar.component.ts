import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {CommonModule, DOCUMENT} from '@angular/common';
import {EventService} from "../../core/services/event.service";
import { AuthService } from '../../core/services/auth.service';
import { AuthfakeauthenticationService } from '../../core/services/authfakeauthentication.service';
import { TokenStorageService } from '../../core/services/token-storage.service';
import {Router, RouterLink} from "@angular/router";

import {SimplebarAngularModule} from "simplebar-angular";

import {
  NgbDropdownMenu,
  NgbDropdown,
  NgbDropdownToggle,
  NgbNavContent,
  NgbNav,
  NgbNavItem, NgbNavLink, NgbNavOutlet
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, SimplebarAngularModule, NgbDropdownMenu, NgbDropdown, NgbDropdownToggle, RouterLink, NgbNavContent, NgbNav, NgbNavItem, NgbNavLink, NgbNavOutlet],
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss']
})
export class TopbarComponent {
  element: any;
  mode: string | undefined;
  @Output() mobileMenuButtonClicked = new EventEmitter();

  userData: any;

  constructor(@Inject(DOCUMENT) private document: any, private eventService: EventService,
              private router: Router, private TokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.userData = this.TokenStorageService.getUser();
    this.element = document.documentElement;

    // Cookies wise Language set



    //  Fetch Data


  }

  /**
   * Toggle the menu bar when having mobile screen
   */
  toggleMobileMenu(event: any) {
    document.querySelector('.hamburger-icon')?.classList.toggle('open')
    event.preventDefault();
    this.mobileMenuButtonClicked.emit();
  }

  /**
   * Fullscreen method
   */
  fullscreen() {
    document.body.classList.toggle('fullscreen-enable');
    if (
      !document.fullscreenElement && !this.element.mozFullScreenElement &&
      !this.element.webkitFullscreenElement) {
      if (this.element.requestFullscreen) {
        this.element.requestFullscreen();
      } else if (this.element.mozRequestFullScreen) {
        /* Firefox */
        this.element.mozRequestFullScreen();
      } else if (this.element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.element.webkitRequestFullscreen();
      } else if (this.element.msRequestFullscreen) {
        /* IE/Edge */
        this.element.msRequestFullscreen();
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

  ngAfterViewInit() {
  }

  /**
   * Topbar Light-Dark Mode Change
   */
  changeMode(mode: string) {
    console.log('mode', mode)
    this.mode = mode;
    this.eventService.broadcast('changeMode', mode);

    switch (mode) {
      case 'light':
        document.documentElement.setAttribute('data-bs-theme', "light");
        document.documentElement.setAttribute('data-sidebar', "light");
        break;
      case 'dark':
        document.documentElement.setAttribute('data-bs-theme', "dark");
        document.documentElement.setAttribute('data-sidebar', "dark");
        break;
      default:
        document.documentElement.setAttribute('data-bs-theme', "light");
        break;
    }
  }

  /***
   * Language Listing
   */


  /***
   * Language Value Set
   */




  /**
   * Logout the user
   */
  logout() {
    //this.authService.logout();
    // if (environment.defaultauth === 'firebase') {
    //   this.authService.logout();
    // } else {
    //   this.authFackservice.logout();
    // }
    this.router.navigate(['/auth/login']);
  }

  windowScroll() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      //(document.getElementById('back-to-top') as HTMLElement).style.display = "block";
      document.getElementById('page-topbar')?.classList.add('topbar-shadow')
    } else {
      //(document.getElementById('back-to-top') as HTMLElement).style.display = "none";
      document.getElementById('page-topbar')?.classList.remove('topbar-shadow')
    }
  }

  // Delete Item


  // Search Topbar
  Search() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var input: any, filter: any, ul: any, li: any, a: any | undefined, i: any, txtValue: any;
    input = document.getElementById("search-options") as HTMLAreaElement;
    filter = input.value.toUpperCase();
    var inputLength = filter.length;

    if (inputLength > 0) {
      dropdown.classList.add("show");
      searchOptions.classList.remove("d-none");
      var inputVal = input.value.toUpperCase();
      var notifyItem = document.getElementsByClassName("notify-item");

      Array.from(notifyItem).forEach(function (element: any) {
        var notifiTxt = ''
        if (element.querySelector("h6")) {
          var spantext = element.getElementsByTagName("span")[0].innerText.toLowerCase()
          var name = element.querySelector("h6").innerText.toLowerCase()
          if (name.includes(inputVal)) {
            notifiTxt = name
          } else {
            notifiTxt = spantext
          }
        } else if (element.getElementsByTagName("span")) {
          notifiTxt = element.getElementsByTagName("span")[0].innerText.toLowerCase()
        }
        if (notifiTxt)
          element.style.display = notifiTxt.includes(inputVal) ? "block" : "none";

      });
    } else {
      dropdown.classList.remove("show");
      searchOptions.classList.add("d-none");
    }
  }

  /**
   * Search Close Btn
   */
  closeBtn() {
    var searchOptions = document.getElementById("search-close-options") as HTMLAreaElement;
    var dropdown = document.getElementById("search-dropdown") as HTMLAreaElement;
    var searchInputReponsive = document.getElementById("search-options") as HTMLInputElement;
    dropdown.classList.remove("show");
    searchOptions.classList.add("d-none");
    searchInputReponsive.value = "";
  }

}
