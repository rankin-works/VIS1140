// Slide Components Index
// Add/remove slide imports and exports here to enable/disable slides

export { default as TitleSlide } from './TitleSlide';
export { default as WelcomeSlide } from './WelcomeSlide';
export { default as ProcessSlide } from './ProcessSlide';
export { default as ToolsSlide } from './ToolsSlide';
export { default as ComparisonSlide } from './ComparisonSlide';
export { default as DemoSlide } from './DemoSlide';
export { default as MathSlide } from './MathSlide';
export { default as VectorCharsSlide } from './VectorCharsSlide';
export { default as RasterCharsSlide } from './RasterCharsSlide';
export { default as FormatsSlide } from './FormatsSlide';
export { default as WorkflowSlide } from './WorkflowSlide';
export { default as RequirementsSlide } from './RequirementsSlide';
export { default as SubmittingSlide } from './SubmittingSlide';
export { default as CritiqueSlide } from './CritiqueSlide';
export { default as PolicySlide } from './PolicySlide';
export { default as QuestionsSlide } from './QuestionsSlide';
export { default as SVGEditorSlide } from './SVGEditorSlide';

// Slide type to component mapping
import TitleSlide from './TitleSlide';
import WelcomeSlide from './WelcomeSlide';
import ProcessSlide from './ProcessSlide';
import ToolsSlide from './ToolsSlide';
import ComparisonSlide from './ComparisonSlide';
import DemoSlide from './DemoSlide';
import MathSlide from './MathSlide';
import VectorCharsSlide from './VectorCharsSlide';
import RasterCharsSlide from './RasterCharsSlide';
import FormatsSlide from './FormatsSlide';
import WorkflowSlide from './WorkflowSlide';
import RequirementsSlide from './RequirementsSlide';
import SubmittingSlide from './SubmittingSlide';
import CritiqueSlide from './CritiqueSlide';
import PolicySlide from './PolicySlide';
import QuestionsSlide from './QuestionsSlide';
import SVGEditorSlide from './SVGEditorSlide';

export const slideComponents = {
  'title': TitleSlide,
  'welcome': WelcomeSlide,
  'process': ProcessSlide,
  'tools': ToolsSlide,
  'comparison': ComparisonSlide,
  'demo': DemoSlide,
  'math': MathSlide,
  'vector-chars': VectorCharsSlide,
  'raster-chars': RasterCharsSlide,
  'formats': FormatsSlide,
  'workflow': WorkflowSlide,
  'requirements': RequirementsSlide,
  'submitting': SubmittingSlide,
  'critique': CritiqueSlide,
  'policy': PolicySlide,
  'questions': QuestionsSlide,
  'svg-editor': SVGEditorSlide,
};

export function renderSlide(type) {
  const SlideComponent = slideComponents[type];
  if (SlideComponent) {
    return <SlideComponent />;
  }
  return null;
}
