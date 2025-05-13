// @ts-nocheck
import { useCallback, useEffect, useState, Component, ErrorInfo, ReactNode } from "react";
import { Excalidraw } from "@excalidraw/excalidraw";

const STORAGE_KEY = "excalidraw-data";
const MAX_CANVAS_WIDTH = 2048; // Reduced from 4096 to avoid browser limits
const MAX_CANVAS_HEIGHT = 2048; // Reduced from 4096 to avoid browser limits

// Error boundary component
class ExcalidrawErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Excalidraw error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red" }}>
          <h3>Something went wrong with the drawing canvas</h3>
          <p>{this.state.error?.message}</p>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              window.location.reload();
            }}
          >
            Reset Canvas
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Default initial state with required properties
const defaultAppState = {
  collaborators: [],
  currentChartType: "bar",
  currentItemBackgroundColor: "transparent",
  currentItemEndArrowhead: null,
  currentItemFillStyle: "hachure",
  currentItemFontFamily: 1,
  currentItemFontSize: 20,
  currentItemLinearStrokeSharpness: "round",
  currentItemOpacity: 100,
  currentItemRoughness: 1,
  currentItemStartArrowhead: null,
  currentItemStrokeColor: "#000000",
  currentItemStrokeSharpness: "sharp",
  currentItemStrokeStyle: "solid",
  currentItemStrokeWidth: 1,
  currentItemTextAlign: "left",
  cursorButton: "up",
  draggingElement: null,
  editingElement: null,
  editingGroupId: null,
  editingLinearElement: null,
  elementLocked: false,
  elementType: "selection",
  errorMessage: null,
  exportBackground: true,
  exportScale: 1,
  exportWithDarkMode: false,
  gridSize: null,
  isBindingEnabled: true,
  isLibraryOpen: false,
  isLoading: false,
  isResizing: false,
  isRotating: false,
  lastPointerDownWith: "mouse",
  multiElement: null,
  name: "Excalidraw",
  openMenu: null,
  openPopup: null,
  pasteDialog: { shown: false, data: null },
  previousSelectedElementIds: {},
  resizingElement: null,
  scrolledOutside: false,
  scrollX: 0,
  scrollY: 0,
  selectedElementIds: {},
  selectedGroupIds: {},
  selectionElement: null,
  shouldCacheIgnoreZoom: false,
  showHelpDialog: false,
  showStats: false,
  startBoundElement: null,
  suggestedBindings: [],
  theme: "light",
  viewBackgroundColor: "#ffffff",
  viewModeEnabled: false,
  zenModeEnabled: false,
  zoom: { value: 1 },
};

export const ExcalidrawCanvas = () => {
  const [initialData, setInitialData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [excalidrawAPI, setExcalidrawAPI] = useState(null);

  // Load saved data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          // Ensure appState has all required properties
          setInitialData({
            elements: parsedData.elements || [],
            appState: {
              ...defaultAppState,
              ...parsedData.appState,
            },
          });
        } else {
          // Initialize with empty state
          setInitialData({
            elements: [],
            appState: defaultAppState,
          });
        }
      } catch (err) {
        console.error("Failed to load saved Excalidraw data:", err);
        setError(err instanceof Error ? err : new Error("Failed to load data"));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const onChange = useCallback((elements, appState) => {
    try {
      // Check canvas bounds
      const bounds = excalidrawAPI?.getSceneBounds?.();
      if (bounds && (bounds.width > MAX_CANVAS_WIDTH || bounds.height > MAX_CANVAS_HEIGHT)) {
        throw new Error("Drawing exceeds maximum canvas size");
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          elements,
          appState: {
            ...defaultAppState,
            ...appState,
          },
        })
      );
    } catch (err) {
      console.error("Failed to save Excalidraw data:", err);
      setError(err instanceof Error ? err : new Error("Failed to save data"));
    }
  }, [excalidrawAPI]);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h3>Error</h3>
        <p>{error.message}</p>
        <button
          onClick={() => {
            localStorage.removeItem(STORAGE_KEY);
            window.location.reload();
          }}
        >
          Reset Canvas
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <div>Loading drawing canvas...</div>;
  }

  return (
    <ExcalidrawErrorBoundary>
      <div style={{ 
        width: "100%", 
        height: "700px",
        maxWidth: `${MAX_CANVAS_WIDTH}px`,
        maxHeight: `${MAX_CANVAS_HEIGHT}px`,
        overflow: "hidden"
      }}>
        <Excalidraw
          initialData={initialData || { elements: [], appState: defaultAppState }}
          onChange={onChange}
          onPointerUpdate={() => {
            // Check canvas bounds periodically
            const bounds = excalidrawAPI?.getSceneBounds?.();
            if (bounds && (bounds.width > MAX_CANVAS_WIDTH || bounds.height > MAX_CANVAS_HEIGHT)) {
              setError(new Error("Drawing exceeds maximum canvas size"));
            }
          }}
          excalidrawAPI={setExcalidrawAPI}
          viewModeEnabled={false}
          zenModeEnabled={false}
          gridModeEnabled={false}
        />
      </div>
    </ExcalidrawErrorBoundary>
  );
}; 