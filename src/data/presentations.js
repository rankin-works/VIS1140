// Presentation configuration - Add new presentations here
import { slides as day1Slides } from './slides';
import day1Thumbnail from '../assets/day-1-thumbnail.png';

export const presentations = [
  {
    id: 'day-1',
    title: 'Day 1: Design Processes',
    description: 'Introduction to design processes, Adobe Creative Cloud tools, and vector vs raster graphics.',
    thumbnail: day1Thumbnail,
    slides: day1Slides
  }
  // Future presentations will be added here:
  // { id: 'project-1', title: 'Project 1: ...', description: '...', slides: project1Slides }
];

export const getPresentation = (id) => presentations.find(p => p.id === id);

export default presentations;
