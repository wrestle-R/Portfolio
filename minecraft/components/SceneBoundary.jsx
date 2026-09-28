import { Component } from "react";
export default class SceneBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure?.(
      "The 3D world couldn’t load. You can still read the complete portfolio.",
      true,
    );
  }
  render() {
    return this.state.failed
      ? this.props.fallback || null
      : this.props.children;
  }
}
