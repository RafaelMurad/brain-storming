import { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with us',
};

export default function ContactPage() {
  return (
    <div className="section-padding">
      <div className="container-custom">
        <div className="max-w-xl mx-auto">
          <span className="label text-primary-500 mb-4 block">Contact</span>
          <h1 className="heading-xl mb-6">Get in Touch</h1>
          <p className="body-lg mb-8">
            Have a project in mind? Fill out the form below and we&apos;ll get back
            to you within 24 hours.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
