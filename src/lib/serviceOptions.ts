export const serviceOptions = [
  { value: 'Detailing', label: 'Detailing', price: 800 },
  { value: 'Car Wrap', label: 'Car Wrap', price: 2000 },
  { value: 'Paint', label: 'Paint', price: 2400 },
  { value: 'Full Diagnostic', label: 'Full Diagnostic', price: 800 },
  { value: 'Oil Change', label: 'Oil Change', price: 200 },
  { value: 'Battery Replacement', label: 'Battery Replacement', price: 420 },
  { value: 'Brake Inspection', label: 'Brake Inspection', price: 400 },
  { value: 'Tire Rotation', label: 'Tire Rotation', price: 160 },
  { value: 'Alignment Check', label: 'Alignment Check', price: 240 },
];

// Optional: Utility to calculate total price
export const calculateServicePrice = (selectedServices: string[]) => {
  return serviceOptions
    .filter(option => selectedServices.includes(option.value))
    .reduce((sum, option) => sum + option.price, 0);
};
