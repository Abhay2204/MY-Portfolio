export interface NavItem {
  label: string;
  href: string;
}

export interface ExperienceItem {
  year: string;
  role: string;
  company: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  description: string;
}

export interface TestimonialItem {
  id: number;
  text: string;
  author: string;
  role: string;
  image: string;
}

export interface ClientItem {
  name: string;
  logo?: string; // Optional if we just use text
}
