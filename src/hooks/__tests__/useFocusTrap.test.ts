import { renderHook } from '@testing-library/react-hooks';
import { useFocusTrap } from '../useFocusTrap';

describe('useFocusTrap', () => {
  const mockFocusableElement = {
    focus: jest.fn(),
    hasAttribute: () => false,
    getAttribute: () => null,
    tabIndex: 0
  } as unknown as HTMLElement;

  it('should initialize with correct state', () => {
    const { result } = renderHook(() => useFocusTrap({ enabled: true }));
    expect(result.current.containerRef).toBeDefined();
    expect(typeof result.current.getFocusableElements).toBe('function');
  });

  it('should handle disabled state', () => {
    const { result } = renderHook(() => useFocusTrap({ enabled: false }));
    const elements = result.current.getFocusableElements();
    expect(elements).toHaveLength(0);
  });

  it('should get focusable elements', () => {
    const { result } = renderHook(() => useFocusTrap({ enabled: true }));
    
    // Mock the container ref
    Object.defineProperty(result.current.containerRef, 'current', {
      value: {
        querySelectorAll: () => [mockFocusableElement]
      }
    });

    const elements = result.current.getFocusableElements();
    expect(elements).toHaveLength(1);
  });
});