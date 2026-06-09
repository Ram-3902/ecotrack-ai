import { Component } from 'react';
import PropTypes from 'prop-types';


/**
 * ErrorBoundary is a React class component that catches JavaScript errors
 * anywhere in its child component tree, logs those errors, and displays
 * a graceful fallback UI instead of crashing the entire application.
 *
 * This provides defensive resilience against unexpected runtime errors
 * caused by corrupted data, edge cases, or third-party library failures.
 *
 * @extends {Component}
 *
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Updates state when an error is thrown in a descendant component.
   *
   * @param {Error} error - The error that was thrown.
   * @returns {Object} Updated state with error information.
   */
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  /**
   * Logs error details for debugging purposes.
   *
   * @param {Error} error - The error that was thrown.
   * @param {Object} errorInfo - Additional React error information including component stack.
   */
  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error);
    console.error('[ErrorBoundary] Component stack:', errorInfo?.componentStack);
  }

  /**
   * Resets the error state and attempts to re-render children.
   */
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '40px',
            textAlign: 'center',
            fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
          }}
        >
          <div style={{ fontSize: '48px', marginBottom: '16px' }} aria-hidden="true">⚠️</div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#f43f5e' }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: '14px', color: '#94a3b8', maxWidth: '400px', lineHeight: 1.6, marginBottom: '24px' }}>
            An unexpected error occurred. Your data is safe. Please try refreshing the page or click the button below to recover.
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              background: '#10b981',
              color: '#0f172a',
              fontWeight: 600,
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;

