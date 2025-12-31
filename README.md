# parkrun Roster Printer Pro

A Chrome extension that makes printing parkrun volunteer rosters clean, easy, and customizable.

## Features

- **Select dates to print**: Choose which roster dates to include in your printout
- **Clean formatting**: Removes headers, navigation, and clutter for a professional printout
- **Smart orientation**: Automatically uses portrait for single dates, landscape for multiple dates
- **Simple interface**: Easy-to-use popup with checkboxes for date selection

## Installation

1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the `parkrun-printer` directory
5. The extension icon will appear in your Chrome toolbar

## Usage

1. Navigate to any parkrun volunteer roster page (e.g., `https://www.parkrun.org.uk/[your-parkrun]/futureroster/`)
2. Click the parkrun Roster Printer Pro extension icon in your toolbar
3. Select which dates you want to include in the printout using the checkboxes
4. Click "Print Roster"
5. The browser print dialog will open with your customized roster
6. Print or save as PDF

## Permissions

This extension requires the following permissions:

- **activeTab**: To access and modify the current parkrun roster page
- **scripting**: To inject print styles and hide unwanted columns
- **storage**: For future feature enhancements
- **host_permissions**: Limited to parkrun.org.uk and parkrun.com domains

## Technical Details

- **Manifest Version**: 3
- **Version**: 2.0
- **Compatible with**: Chrome and Chromium-based browsers

## Files

- `manifest.json` - Extension configuration
- `popup.html` - Extension popup interface
- `popup.js` - Core functionality and date selection logic
- `print-stylesheet.css` - Print-specific styling to clean up the output
- `example_roster.html` - Sample roster page for testing

## License

This project is provided as-is for personal use with parkrun volunteer rosters.
