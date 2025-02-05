import { runTests } from './testRunner';

// Import all test files here
import '../components/__tests__/TimerCircle.test';
import '../hooks/__tests__/useTimerMetrics.test';
import '../hooks/__tests__/useTimerControls.test';
import '../utils/__tests__/timeUtils.test';

// Run all tests
console.log('Running all tests...');
runTests().catch(console.error);