# N8N Timesheet Workflows

Automated timesheet folder and file setup using N8N.

## Quick Start

1. Copy template files from `/templates/` to your templates location
2. Import `workflows/timesheet-setup.json` into your N8N instance
3. Trigger via HTTP POST with a timesheet date
4. Get back a folder with formatted files

## What's Included

- **workflows/** — N8N workflow JSON files
  - `timesheet-setup.json` — Main timesheet automation workflow
- **templates/** — Template files (Invoice & Timesheet)
- **docs/** — Setup & usage documentation

## Workflow: Timesheet Setup

Accepts a timesheet end date and:
1. Creates a dated folder (`YYYY.MM.DD`)
2. Copies Word invoice template
3. Copies Excel timesheet template
4. Updates Excel cell E8 with the date

**Input:** `{"timesheetDate": "4/19/2026"}`  
**Output:** Folder `/output/2026.04.19/` with files

See [WORKFLOW_SETUP.md](docs/WORKFLOW_SETUP.md) for installation and usage.

## File Structure

```
n8n-workflows/
├── workflows/
│   └── timesheet-setup.json
├── templates/
│   ├── RossNanton-Invoice-yyyy.mm.dd.docx
│   └── RossNanton-Timesheet-yyyy.mm.dd.xlsx
├── docs/
│   └── WORKFLOW_SETUP.md
├── README.md
└── .gitignore
```

## Getting Started

1. **Import the workflow:**
   - Open N8N → Workflows → Import from File
   - Select `timesheet-setup.json`

2. **Update paths if needed:**
   - Edit paths in the "Format Date" node if your directories differ

3. **Activate & test:**
   - Click Activate
   - Send a test POST request with `timesheetDate`

4. **Monitor output:**
   - Check `/output/` for generated folders

## Requirements

- N8N instance (Docker or local)
- Node.js `xlsx` package (included in most N8N images)
- Read/write access to template and output directories

## Support

For issues, see [WORKFLOW_SETUP.md](docs/WORKFLOW_SETUP.md) → Troubleshooting section.

---

Made with ⚙️ by N8Nbot
