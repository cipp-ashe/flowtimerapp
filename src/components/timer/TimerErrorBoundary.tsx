import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class TimerErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service
    console.error('Timer Error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="mx-auto bg-card/80 backdrop-blur-sm border-destructive/20 shadow-lg p-6">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center text-destructive">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-semibold text-destructive">
              Timer Error
            </h2>
            <p className="text-muted-foreground">
              {this.state.error?.message || 'Something went wrong with the timer.'}
            </p>
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="border-destructive/20 hover:bg-destructive/10"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}