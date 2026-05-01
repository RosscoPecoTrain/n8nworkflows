# Timesheet Setup Workflow

## Overview

This N8N workflow automates the creation of timestamped timesheet folders and files.

**Input:** Timesheet end date (e.g., `4/19/2026`)  
**Output:** Dated folder with copied and updated templates

## What It Does

1. **Accepts** POST request with `timesheetDate` parameter
2. **Formats** date from `M/D/YYYY` → `YYYY.MM.DD`
3. **Creates** output folder: `/timesheet/output/YYYY.MM.DD/`
4. **Copies** Word invoice template (renamed with date)
5. **Copies** Excel timesheet template (renamed with date)
6. **Updates** Excel cell E8 with the timesheet date
7. **Returns** JSON response with success status

## Installation

### 1. Set Up the Workflow File Structure

Ensure your workspace has this structure:

```
n8n/timesheet/
├── n8n-workflows/
│   ├── workflows/
│   │   └── timesheet-setup.json
│   ├── templates/
│   │   ├── RossNanton-Invoice-yyyy.mm.dd.docx
│   │   └── RossNanton-Timesheet-yyyy.mm.dd.xlsx
│   └── docs/
│       └── WORKFLOW_SETUP.md
└── output/  (created by workflow on first run)
```

### 2. Import Workflow into N8N

1. Open your N8N instance (http://localhost:5678 or your instance URL)
2. Go to **Workflows**
3. Click **+ New Workflow**
4. Click **Import from File** (or Import from URL if you have the workflow hosted)
5. Select `timesheet-setup.json`
6. Adjust the file paths if needed (see **Configuration** below)

### 3. Activate the Workflow

Once imported:
- Click **Save** to save the workflow
- Click the **Activate** toggle to enable the webhook
- Note the webhook URL: N8N will display it once activated

## Configuration

### File Paths

The workflow uses hardcoded paths:

```
Template Path: /home/node/.openclaw/workspace/projects/n8n/timesheet/n8n-workflows/templates/
Output Path:  /home/node/.openclaw/workspace/projects/n8n/timesheet/output/
```

**If your paths differ**, edit the "Format Date" node:
- Click the "Format Date" function node
- Adjust `basePath` and `templatePath` variables
- Save and re-activate

### Template Files

Ensure the template files exist and are readable:
- `RossNanton-Invoice-yyyy.mm.dd.docx`
- `RossNanton-Timesheet-yyyy.mm.dd.xlsx`

## Usage

### Trigger via HTTP POST

```bash
curl -X POST http://localhost:5678/webhook/timesheet-setup \
  -H "Content-Type: application/json" \
  -d '{"timesheetDate": "4/19/2026"}'
```

### Expected Response

```json
{
  "status": "success",
  "message": "Timesheet setup completed successfully",
  "details": {
    "timesheetDate": "4/19/2026",
    "folderName": "2026.04.19",
    "outputPath": "/home/node/.openclaw/workspace/projects/n8n/timesheet/output/2026.04.19",
    "filesCreated": [
      "RossNanton-Invoice-2026.04.19.docx",
      "RossNanton-Timesheet-2026.04.19.xlsx (Cell E8 updated)"
    ]
  }
}
```

## Nodes Breakdown

| Node | Type | Purpose |
|------|------|---------|
| **Webhook Trigger** | HTTP | Receives POST requests with `timesheetDate` |
| **Format Date** | Function (JS) | Parses and formats date to `YYYY.MM.DD` |
| **Create Output Folder** | Function (JS) | Creates dated folder in output directory |
| **Copy Word Template** | Function (JS) | Copies invoice template with new name |
| **Copy Excel Template** | Function (JS) | Copies timesheet template with new name |
| **Update Excel Cell E8** | Function (JS) | Updates cell E8 with timesheet date |
| **Response** | Function (JS) | Returns success JSON to caller |

## Dependencies

The workflow uses Node.js built-in modules:
- `fs` — file system operations (copy, mkdir)
- `xlsx` — Excel file manipulation

**Note:** Ensure your N8N instance has the `xlsx` package installed. Most N8N Docker images include it by default. If not, add it to your Docker image or install via N8N's Package Manager.

## Troubleshooting

### Workflow Fails to Activate

- Check that webhook is properly configured
- Ensure N8N has network access to the endpoint

### File Copy Fails

- Verify template file paths exist and are readable
- Check file permissions: `ls -la /path/to/templates/`
- Ensure N8N process has read/write access to output directory

### Excel Update Fails

- Verify `xlsx` package is installed in N8N
- Check that Excel file is not corrupted
- Cell E8 must exist in the first worksheet

### Date Format Issues

- Accepted format: `M/D/YYYY`, `MM/DD/YYYY`, or ISO format
- If you need different formats, edit the "Format Date" node

## Testing

### Test via N8N UI

1. Open the workflow in N8N
2. Click **Test Workflow**
3. In the webhook trigger node, use **Test** to send a test payload:
   ```json
   {"timesheetDate": "4/19/2026"}
   ```
4. Check the output nodes to verify success

### Test via Command Line

```bash
# Get the webhook URL from N8N UI, then:
curl -X POST https://your-n8n-instance.com/webhook/timesheet-setup \
  -H "Content-Type: application/json" \
  -d '{"timesheetDate": "4/19/2026"}'
```

## Output Structure

After running with date `4/19/2026`, the output folder will look like:

```
n8n/timesheet/output/2026.04.19/
├── RossNanton-Invoice-2026.04.19.docx
└── RossNanton-Timesheet-2026.04.19.xlsx
    └── Cell E8 = "4/19/2026"
```

## Notes

- The workflow is idempotent: running it multiple times with the same date will overwrite files (no error)
- Cell E8 is hardcoded; if you need a different cell, edit the "Update Excel Cell E8" node
- The timesheet date is stored as text in E8; if you need it as a date value, modify the xlsx cell type in the update node
