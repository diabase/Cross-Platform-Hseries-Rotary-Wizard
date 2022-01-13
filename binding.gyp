 {
  "targets": [
    {
      "target_name": "fileProcessing",
      "sources": [ "fileProcessing.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
      ]
    },
    {
      "target_name": "gcodeProcessing",
      "sources": [ "gcodeProcessing.cc" ],
      "include_dirs": [
        "<!(node -e \"require('nan')\")"
        
      ]
    },
  ]
}