$root = "c:\Users\mc_nprouza28\Documents\GitHub\Clientwebresearch\website"
$imagesDir = Join-Path $root "images"
New-Item -ItemType Directory -Path $imagesDir -Force | Out-Null

$items = @(
    @{ Name = "paint-correction.jpg"; Url = "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80" },
    @{ Name = "hand-wash.jpg"; Url = "https://images.unsplash.com/photo-1520050206274-a1ae44613e6d?auto=format&fit=crop&w=1200&q=80" },
    @{ Name = "interior-detail.jpg"; Url = "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80" },
    @{ Name = "ceramic-coating.jpg"; Url = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80" },
    @{ Name = "sports-car-finish.jpg"; Url = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=600&q=80" },
    @{ Name = "porsche-polish.jpg"; Url = "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80" },
    @{ Name = "ceramic-coating-detail.jpg"; Url = "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=600&q=80" },
    @{ Name = "polishing-wheel.jpg"; Url = "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80" }
)

foreach ($item in $items) {
    $path = Join-Path $imagesDir $item.Name
    Invoke-WebRequest -Uri $item.Url -OutFile $path
    Write-Output "Saved $path"
}

Write-Output "Done"
