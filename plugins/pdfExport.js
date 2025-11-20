import { defineNuxtPlugin } from '#app';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default defineNuxtPlugin(() => {
  return {
    provide: {
      pdf: {
        create: () => new jsPDF(),
        autoTable: autoTable
      }
    }
  }
});
