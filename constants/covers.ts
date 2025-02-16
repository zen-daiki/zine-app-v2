import type { CoverOption } from '@/types/cover';

const Cover1Image = require('@/assets/images/chooseCover_01.webp');
const Cover2Image = require('@/assets/images/chooseCover_02.webp');
const Cover3Image = require('@/assets/images/chooseCover_03.webp');

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
