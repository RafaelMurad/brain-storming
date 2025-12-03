import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from './components/Home';
import { LessonLayout } from './components/LessonLayout';

// Lesson imports will be added as we create them
import Lesson01Example from './lessons/01-framer-basics/Example';
import Lesson01Exercise from './lessons/01-framer-basics/Exercise';
import lesson01Content from './lessons/01-framer-basics/LESSON.md?raw';

import Lesson02Example from './lessons/02-framer-variants/Example';
import Lesson02Exercise from './lessons/02-framer-variants/Exercise';
import lesson02Content from './lessons/02-framer-variants/LESSON.md?raw';

import Lesson03Example from './lessons/03-framer-gestures/Example';
import Lesson03Exercise from './lessons/03-framer-gestures/Exercise';
import lesson03Content from './lessons/03-framer-gestures/LESSON.md?raw';

import Lesson04Example from './lessons/04-framer-scroll/Example';
import Lesson04Exercise from './lessons/04-framer-scroll/Exercise';
import lesson04Content from './lessons/04-framer-scroll/LESSON.md?raw';

import Lesson05Example from './lessons/05-framer-transforms/Example';
import Lesson05Exercise from './lessons/05-framer-transforms/Exercise';
import lesson05Content from './lessons/05-framer-transforms/LESSON.md?raw';

import Lesson06Example from './lessons/06-gsap-basics/Example';
import Lesson06Exercise from './lessons/06-gsap-basics/Exercise';
import lesson06Content from './lessons/06-gsap-basics/LESSON.md?raw';

import Lesson07Example from './lessons/07-gsap-timelines/Example';
import Lesson07Exercise from './lessons/07-gsap-timelines/Exercise';
import lesson07Content from './lessons/07-gsap-timelines/LESSON.md?raw';

import Lesson08Example from './lessons/08-gsap-scrolltrigger/Example';
import Lesson08Exercise from './lessons/08-gsap-scrolltrigger/Exercise';
import lesson08Content from './lessons/08-gsap-scrolltrigger/LESSON.md?raw';

import Lesson09Example from './lessons/09-advanced-effects/Example';
import Lesson09Exercise from './lessons/09-advanced-effects/Exercise';
import lesson09Content from './lessons/09-advanced-effects/LESSON.md?raw';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/lesson/01-framer-basics"
          element={
            <LessonLayout
              lessonId="01-framer-basics"
              lessonContent={lesson01Content}
              ExampleComponent={Lesson01Example}
              ExerciseComponent={Lesson01Exercise}
            />
          }
        />

        <Route
          path="/lesson/02-framer-variants"
          element={
            <LessonLayout
              lessonId="02-framer-variants"
              lessonContent={lesson02Content}
              ExampleComponent={Lesson02Example}
              ExerciseComponent={Lesson02Exercise}
            />
          }
        />

        <Route
          path="/lesson/03-framer-gestures"
          element={
            <LessonLayout
              lessonId="03-framer-gestures"
              lessonContent={lesson03Content}
              ExampleComponent={Lesson03Example}
              ExerciseComponent={Lesson03Exercise}
            />
          }
        />

        <Route
          path="/lesson/04-framer-scroll"
          element={
            <LessonLayout
              lessonId="04-framer-scroll"
              lessonContent={lesson04Content}
              ExampleComponent={Lesson04Example}
              ExerciseComponent={Lesson04Exercise}
            />
          }
        />

        <Route
          path="/lesson/05-framer-transforms"
          element={
            <LessonLayout
              lessonId="05-framer-transforms"
              lessonContent={lesson05Content}
              ExampleComponent={Lesson05Example}
              ExerciseComponent={Lesson05Exercise}
            />
          }
        />

        <Route
          path="/lesson/06-gsap-basics"
          element={
            <LessonLayout
              lessonId="06-gsap-basics"
              lessonContent={lesson06Content}
              ExampleComponent={Lesson06Example}
              ExerciseComponent={Lesson06Exercise}
            />
          }
        />

        <Route
          path="/lesson/07-gsap-timelines"
          element={
            <LessonLayout
              lessonId="07-gsap-timelines"
              lessonContent={lesson07Content}
              ExampleComponent={Lesson07Example}
              ExerciseComponent={Lesson07Exercise}
            />
          }
        />

        <Route
          path="/lesson/08-gsap-scrolltrigger"
          element={
            <LessonLayout
              lessonId="08-gsap-scrolltrigger"
              lessonContent={lesson08Content}
              ExampleComponent={Lesson08Example}
              ExerciseComponent={Lesson08Exercise}
            />
          }
        />

        <Route
          path="/lesson/09-advanced-effects"
          element={
            <LessonLayout
              lessonId="09-advanced-effects"
              lessonContent={lesson09Content}
              ExampleComponent={Lesson09Example}
              ExerciseComponent={Lesson09Exercise}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
