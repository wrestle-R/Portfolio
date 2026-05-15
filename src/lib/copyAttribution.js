const PORTFOLIO_ATTRIBUTION_LINE = "Copied from Russel's Portfolio";

function getTextControlSelection(target) {
  if (!(target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)) {
    return "";
  }

  const start = target.selectionStart ?? 0;
  const end = target.selectionEnd ?? 0;

  if (end <= start) {
    return "";
  }

  return target.value.slice(start, end);
}

function getSelectedText(event) {
  const fromControl = getTextControlSelection(event.target);
  if (fromControl) {
    return fromControl;
  }

  const selection = window.getSelection();
  if (!selection) {
    return "";
  }

  return selection.toString();
}

export function registerCopyAttribution() {
  const handleCopy = (event) => {
    const selectedText = getSelectedText(event).trim();

    if (!selectedText || !event.clipboardData) {
      return;
    }

    const textWithAttribution = selectedText.endsWith(PORTFOLIO_ATTRIBUTION_LINE)
      ? selectedText
      : `${selectedText}\n\n${PORTFOLIO_ATTRIBUTION_LINE}`;

    event.preventDefault();
    event.clipboardData.setData("text/plain", textWithAttribution);
  };

  document.addEventListener("copy", handleCopy);

  return () => {
    document.removeEventListener("copy", handleCopy);
  };
}
