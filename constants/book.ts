import type { BookSize, CoverOption } from '@/types/book';

const SquareImage = require('@/assets/images/chooseBook_01.png');
const RectangleImage = require('@/assets/images/chooseBook_02.png');
const Cover1Image = require('@/assets/images/chooseCover_01.webp');
const Cover2Image = require('@/assets/images/chooseCover_02.webp');
const Cover3Image = require('@/assets/images/chooseCover_03.webp');

export const BOOK_SIZES: BookSize[] = [
  {
    id: '1',
    type: 'vertical',
    title: '長方形',
    size: '102×102mm',
    price: '1,360円(税込)より',
    image: SquareImage,
  },
  {
    id: '2',
    type: 'square',
    title: '正方形',
    size: '102×102mm',
    price: '1,360円(税込)より',
    image: RectangleImage,
  },
];

export const COVER_OPTIONS: CoverOption[] = [
  {
    id: '1',
    type: 'orange',
    title: 'オレンジ',
    image: Cover1Image,
  },
  {
    id: '2',
    type: 'sky-blue',
    title: '水色',
    image: Cover2Image,
  },
  {
    id: '3',
    type: 'gray',
    title: 'グレー',
    image: Cover3Image,
  },
];
