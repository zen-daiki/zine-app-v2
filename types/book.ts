export type BookSize = {
  id: string;
  type: 'vertical' | 'square' | 'horizontal';
  title: string;
  size: string;
  price: string;
  image: any;
};

export type CoverOption = {
  id: string;
  type: 'orange' | 'sky-blue' | 'gray';
  title: string;
  image: any;
};