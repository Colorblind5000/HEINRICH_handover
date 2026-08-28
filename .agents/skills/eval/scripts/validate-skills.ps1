[CmdletBinding()]
param(
    [string[]]$Skill
)

$ErrorActionPreference = 'Stop'

$workRoot = $PSScriptRoot
1..4 | ForEach-Object { $workRoot = Split-Path -Parent $workRoot }
$skillsRoot = Join-Path $workRoot '.agents\skills'
$allowedFrontmatter = @('name', 'description', 'license', 'allowed-tools', 'metadata')
$failures = [System.Collections.Generic.List[string]]::new()
$descriptions = @{}
$checked = 0

function Add-Failure {
    param([string]$Message)
    $script:failures.Add($Message)
    Write-Host "[FAIL] $Message"
}

if (-not (Test-Path -LiteralPath $skillsRoot -PathType Container)) {
    throw "Skill root does not exist: $skillsRoot"
}

$directories = Get-ChildItem -LiteralPath $skillsRoot -Directory | Sort-Object Name
if ($Skill) {
    $requested = @($Skill | ForEach-Object { $_.Trim() } | Where-Object { $_ })
    $directories = @($directories | Where-Object { $_.Name -in $requested })
    $missing = @($requested | Where-Object { $_ -notin $directories.Name })
    foreach ($name in $missing) {
        Add-Failure "Requested skill does not exist: $name"
    }
}

foreach ($directory in $directories) {
    $checked++
    $skillPath = Join-Path $directory.FullName 'SKILL.md'
    if (-not (Test-Path -LiteralPath $skillPath -PathType Leaf)) {
        Add-Failure "$($directory.Name): missing SKILL.md"
        continue
    }

    $content = Get-Content -LiteralPath $skillPath -Raw
    $frontmatterMatch = [regex]::Match($content, '\A---\r?\n(?<body>.*?)\r?\n---(?:\r?\n|\z)', 'Singleline')
    if (-not $frontmatterMatch.Success) {
        Add-Failure "$($directory.Name): invalid or missing YAML frontmatter"
        continue
    }

    $frontmatter = $frontmatterMatch.Groups['body'].Value
    $keys = [regex]::Matches($frontmatter, '(?m)^(?<key>[A-Za-z0-9-]+):') |
        ForEach-Object { $_.Groups['key'].Value }
    foreach ($key in $keys) {
        if ($key -notin $allowedFrontmatter) {
            Add-Failure "$($directory.Name): unsupported frontmatter key '$key'"
        }
    }

    $nameMatch = [regex]::Match($frontmatter, '(?m)^name:\s*(?<value>[^\r\n]+)\s*$')
    if (-not $nameMatch.Success) {
        Add-Failure "$($directory.Name): missing single-line name"
    }
    else {
        $name = $nameMatch.Groups['value'].Value.Trim().Trim('"').Trim("'")
        if ($name.Length -gt 64 -or $name -notmatch '^[a-z0-9]+(?:-[a-z0-9]+)*$') {
            Add-Failure "$($directory.Name): invalid skill name '$name'"
        }
        if ($name -ne $directory.Name) {
            Add-Failure "$($directory.Name): frontmatter name '$name' must match its directory"
        }
    }

    $descriptionMatch = [regex]::Match($frontmatter, '(?m)^description:\s*(?<value>[^\r\n]+)\s*$')
    if (-not $descriptionMatch.Success) {
        Add-Failure "$($directory.Name): missing single-line description"
    }
    else {
        $description = $descriptionMatch.Groups['value'].Value.Trim().Trim('"').Trim("'")
        if (-not $description -or $description.Length -gt 1024) {
            Add-Failure "$($directory.Name): description must contain 1-1024 characters"
        }
        if ($description -match '[<>]') {
            Add-Failure "$($directory.Name): description contains angle brackets"
        }
        if ($description -match '(?i)\bTODO\b') {
            Add-Failure "$($directory.Name): description contains TODO"
        }
        if ($descriptions.ContainsKey($description)) {
            Add-Failure "$($directory.Name): description duplicates '$($descriptions[$description])'"
        }
        else {
            $descriptions[$description] = $directory.Name
        }
    }

    if ($content -match '(?i)\[?TODO[:\]]') {
        Add-Failure "$($directory.Name): unresolved TODO marker"
    }

    $linkMatches = [regex]::Matches($content, '\[[^\]]+\]\((?<target>[^)]+)\)')
    foreach ($linkMatch in $linkMatches) {
        $target = $linkMatch.Groups['target'].Value.Trim().Trim('<', '>')
        if ($target -match '^(?:https?://|mailto:|#)') {
            continue
        }
        $targetPath = ($target -split '#', 2)[0]
        if (-not $targetPath) {
            continue
        }
        $resolved = Join-Path $directory.FullName $targetPath
        if (-not (Test-Path -LiteralPath $resolved)) {
            Add-Failure "$($directory.Name): broken relative link '$target'"
        }
    }

    if ($content -notmatch '(?m)^#\s+\S') {
        Add-Failure "$($directory.Name): missing top-level Markdown heading"
    }

    if (-not ($failures | Where-Object { $_ -like "$($directory.Name):*" })) {
        Write-Host "[PASS] $($directory.Name)"
    }
}

Write-Host "Checked $checked skill(s); $($failures.Count) failure(s)."
if ($failures.Count -gt 0) {
    exit 1
}

