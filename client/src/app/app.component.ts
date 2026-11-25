
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth.service';
import { JobService } from './core/job.service';
import { Job, Application } from './core/models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/">
        <span class="brand-mark">H</span>hire<span>hub</span>
      </a>

      <nav>
        <a routerLink="/">Find jobs</a>
        <a *ngIf="user()?.role === 'seeker'" routerLink="/applications">My applications</a>
        <a *ngIf="user()?.role === 'recruiter' || user()?.role === 'admin'" routerLink="/post-job">Post a job</a>
      </nav>

      <div class="nav-actions">
        <ng-container *ngIf="!user(); else loggedIn">
          <a class="login-link" routerLink="/login" (click)="mode='login'">Log in</a>
          <a class="btn btn-small" routerLink="/register" (click)="mode='register'">Create account</a>
        </ng-container>

        <ng-template #loggedIn>
          <span class="welcome">Hi, {{ user()?.name }}</span>
          <button class="btn btn-small btn-outline" (click)="logout()">Log out</button>
        </ng-template>
      </div>
    </header>

    <main>
      <section class="hero" *ngIf="!isFormRoute()">
        <div class="hero-copy">
          <span class="eyebrow">YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Find work that<br><em>moves you forward.</em></h1>
          <p>Discover opportunities from teams building what comes next.</p>
          <div class="hero-stats">
            <span><b>Fresh opportunities</b><small>Updated regularly</small></span>
            <span><b>Career growth</b><small>Find your fit</small></span>
          </div>
        </div>

        <div class="hero-card">
          <div class="orbit orbit-one"></div>
          <div class="orbit orbit-two"></div>
          <div class="floating-card">
            <span class="mini-icon">↗</span>
            <b>Make your next move</b>
            <small>Great opportunities are closer than you think.</small>
            <span class="card-pill">Explore roles <b>→</b></span>
          </div>
          <div class="hero-dot dot-one"></div>
          <div class="hero-dot dot-two"></div>
        </div>
      </section>

      <section class="content" *ngIf="!isFormRoute()">
        <div class="section-heading">
          <div>
            <span class="eyebrow">OPPORTUNITIES FOR YOU</span>
            <h2>Explore open positions</h2>
          </div>
          <span class="result-count">{{ jobs().length }} jobs found</span>
        </div>

        <div class="filters">
          <label class="search-field">
            <span>⌕</span>
            <input [(ngModel)]="search" (keyup.enter)="loadJobs()" placeholder="Job title, company or keyword">
          </label>

          <label class="search-field">
            <span>⌖</span>
            <input [(ngModel)]="location" (keyup.enter)="loadJobs()" placeholder="City or remote">
          </label>

          <select [(ngModel)]="type">
            <option value="">All job types</option>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
            <option>Contract</option>
            <option>Remote</option>
          </select>

          <button class="btn" (click)="loadJobs()">Search jobs</button>
        </div>

        <div class="notice" *ngIf="message()">{{ message() }}</div>

        <div class="job-grid" *ngIf="jobs().length; else emptyJobs">
          <article class="job-card" *ngFor="let job of jobs()">
            <div class="job-top">
              <div class="company-avatar">{{ initials(job.company) }}</div>
              <span class="tag">{{ job.type }}</span>
            </div>

            <h3>{{ job.title }}</h3>
            <p class="company-name">{{ job.company }}</p>

            <div class="job-meta">
              <span>⌖ {{ job.location }}</span>
              <span>◷ {{ job.category || 'General' }}</span>
            </div>

            <p class="description">{{ job.description }}</p>

            <div class="job-footer">
              <small>{{ job.createdAt | date:'mediumDate' }}</small>
              <button class="text-btn" (click)="apply(job)">Apply now <b>→</b></button>
            </div>
          </article>
        </div>

        <ng-template #emptyJobs>
          <div class="empty-state">
            <div class="empty-icon">⌕</div>
            <h3>No jobs found yet</h3>
            <p>Try another keyword or check back soon for new opportunities.</p>
          </div>
        </ng-template>
      </section>

      <section class="form-page" *ngIf="isFormRoute()">
        <div class="form-intro">
          <span class="eyebrow">WELCOME TO HIREHUB</span>
          <h1>{{ mode === 'login' ? 'Welcome back.' : 'Build your next chapter.' }}</h1>
          <p>{{ mode === 'login' ? 'Sign in to continue your career journey.' : 'Create an account and discover new opportunities.' }}</p>
        </div>

        <form class="auth-card" (ngSubmit)="submitAuth()">
          <h2>{{ mode === 'login' ? 'Log in to your account' : 'Create your account' }}</h2>

          <label *ngIf="mode === 'register'">
            Full name
            <input name="name" [(ngModel)]="form.name" required placeholder="Your name">
          </label>

          <label>
            Email address
            <input name="email" type="email" [(ngModel)]="form.email" required placeholder="you@example.com">
          </label>

          <label>
            Password
            <input name="password" type="password" [(ngModel)]="form.password" required minlength="8" placeholder="At least 8 characters">
          </label>

          <label *ngIf="mode === 'register'">
            I am joining as
            <select name="role" [(ngModel)]="form.role">
              <option value="seeker">Job seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </label>

          <label *ngIf="mode === 'register' && form.role === 'recruiter'">
            Company name
            <input name="companyName" [(ngModel)]="form.companyName" placeholder="Your company">
          </label>

          <p class="form-error" *ngIf="message()">{{ message() }}</p>

          <button class="btn full-btn" [disabled]="busy()">
            {{ busy() ? 'Please wait...' : (mode === 'login' ? 'Log in' : 'Create account') }}
          </button>

          <p class="switch-mode">
            {{ mode === 'login' ? 'New to HireHub?' : 'Already have an account?' }}
            <button type="button" (click)="toggleMode()">
              {{ mode === 'login' ? 'Create an account' : 'Log in' }}
            </button>
          </p>
        </form>
      </section>

      <section class="content dashboard" *ngIf="user() && isApplicationsRoute()">
        <div class="section-heading">
          <div>
            <span class="eyebrow">YOUR CAREER ACTIVITY</span>
            <h2>{{ user()?.role === 'seeker' ? 'My applications' : 'Applications received' }}</h2>
          </div>
        </div>

        <div class="application-list" *ngIf="applications().length; else noApps">
          <article class="application-card" *ngFor="let item of applications()">
            <div>
              <h3>{{ item.job?.title || 'Job application' }}</h3>
              <p>{{ item.job?.company || 'Company' }} · {{ item.applicant?.name || '' }}</p>
              <small>Applied {{ item.createdAt | date:'mediumDate' }}</small>
            </div>

            <div class="application-actions">
              <span class="status">{{ item.status }}</span>
              <select
                *ngIf="user()?.role === 'recruiter' || user()?.role === 'admin'"
                [ngModel]="item.status"
                (ngModelChange)="changeStatus(item._id, $event)">
                <option>Pending</option>
                <option>Reviewed</option>
                <option>Shortlisted</option>
                <option>Rejected</option>
                <option>Accepted</option>
              </select>
            </div>
          </article>
        </div>

        <ng-template #noApps>
          <div class="empty-state">
            <h3>No applications to show</h3>
            <p>Applications will appear here when available.</p>
          </div>
        </ng-template>
      </section>

      <section class="content post-form" *ngIf="user()?.role === 'recruiter' && isPostJobRoute()">
        <span class="eyebrow">GROW YOUR TEAM</span>
        <h2>Post a new opportunity</h2>

        <form class="job-form" (ngSubmit)="createJob()">
          <label>
            Job title
            <input name="title" [(ngModel)]="jobForm.title" required>
          </label>

          <label>
            Company
            <input name="company" [(ngModel)]="jobForm.company" required>
          </label>

          <label>
            Location
            <input name="location" [(ngModel)]="jobForm.location" required>
          </label>

          <label>
            Job type
            <select name="type" [(ngModel)]="jobForm.type">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Internship</option>
              <option>Contract</option>
              <option>Remote</option>
            </select>
          </label>

          <label>
            Category
            <input name="category" [(ngModel)]="jobForm.category">
          </label>

          <label>
            Salary minimum
            <input name="salaryMin" type="number" [(ngModel)]="jobForm.salaryMin">
          </label>

          <label>
            Salary maximum
            <input name="salaryMax" type="number" [(ngModel)]="jobForm.salaryMax">
          </label>

          <label class="wide">
            Description
            <textarea name="description" rows="6" [(ngModel)]="jobForm.description" required></textarea>
          </label>

          <button class="btn" [disabled]="busy()">Publish job</button>
        </form>
      </section>
    </main>

    <footer>
      <a class="brand footer-brand" routerLink="/">
        <span class="brand-mark">H</span>hire<span>hub</span>
      </a>
      <p>Helping people find work that moves them forward.</p>
      <small>© 2026 HireHub. Built with the MEAN stack.</small>
    </footer>

    <router-outlet></router-outlet>
  `
})
export class AppComponent implements OnInit {
  jobs = signal<Job[]>([]);
  applications = signal<Application[]>([]);

  get user() {
    return this.auth.currentUser;
  }

  message = signal('');
  busy = signal(false);

  search = '';
  location = '';
  type = '';

  mode: 'login' | 'register' = 'login';

  form = {
    name: '',
    email: '',
    password: '',
    role: 'seeker',
    companyName: ''
  };

  jobForm: any = {
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    category: 'Technology',
    salaryMin: null,
    salaryMax: null,
    description: ''
  };

  constructor(
    private auth: AuthService,
    private api: JobService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mode = this.router.url === '/register' ? 'register' : 'login';
    this.loadJobs();

    if (this.router.url === '/applications') {
      this.loadApplications();
    }
  }

  isFormRoute(): boolean {
    return this.router.url === '/login' || this.router.url === '/register';
  }

  isApplicationsRoute(): boolean {
    return this.router.url === '/applications';
  }

  isPostJobRoute(): boolean {
    return this.router.url === '/post-job';
  }

  loadJobs(): void {
    this.api.getJobs({
      search: this.search,
      location: this.location,
      type: this.type
    }).subscribe({
      next: (result) => this.jobs.set(result.jobs || []),
      error: (error) => {
        this.message.set(error.error?.message || 'Could not load jobs. Is the API running?');
      }
    });
  }

  submitAuth(): void {
    this.message.set('');
    this.busy.set(true);

    const request = this.mode === 'login'
      ? this.auth.login({
          email: this.form.email,
          password: this.form.password
        })
      : this.auth.register(this.form);

    request.subscribe({
      next: () => {
        this.busy.set(false);
        this.router.navigate(['/']);
        this.loadJobs();
      },
      error: (error) => {
        this.busy.set(false);
        this.message.set(error.error?.message || 'Something went wrong');
      }
    });
  }

  toggleMode(): void {
    this.mode = this.mode === 'login' ? 'register' : 'login';
    this.message.set('');

    this.router.navigate([
      this.mode === 'login' ? '/login' : '/register'
    ]);
  }

  logout(): void {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  initials(value: string): string {
    return value
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  apply(job: Job): void {
    if (!this.user()) {
      this.router.navigate(['/login']);
      this.mode = 'login';
      return;
    }

    if (this.user()?.role !== 'seeker') {
      this.message.set('Only job seekers can apply for jobs.');
      return;
    }

    const coverLetter = window.prompt(
      `Apply for ${job.title} at ${job.company}. Add a short cover letter (optional):`
    ) || '';

    this.api.apply(job._id, coverLetter).subscribe({
      next: () => this.message.set('Application submitted successfully.'),
      error: (error) => {
        this.message.set(error.error?.message || 'Could not submit application');
      }
    });
  }

  loadApplications(): void {
    const request = this.user()?.role === 'seeker'
      ? this.api.myApplications()
      : this.api.receivedApplications();

    request.subscribe({
      next: (result) => this.applications.set(result.applications || []),
      error: (error) => {
        this.message.set(error.error?.message || 'Could not load applications');
      }
    });
  }

  changeStatus(id: string, status: string): void {
    this.api.updateStatus(id, status).subscribe({
      next: () => this.loadApplications(),
      error: (error) => {
        this.message.set(error.error?.message || 'Could not update status');
      }
    });
  }

  createJob(): void {
    this.busy.set(true);

    this.api.createJob(this.jobForm).subscribe({
      next: () => {
        this.busy.set(false);
        this.message.set('Job published successfully.');
        this.router.navigate(['/']);
        this.loadJobs();
      },
      error: (error) => {
        this.busy.set(false);
        this.message.set(error.error?.message || 'Could not publish job');
      }
    });
  }
}
