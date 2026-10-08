// Derived from examples/*.incn by scripts/generate-examples.py.
const homepageExamples = [
  {
    "template": "example-hello",
    "filename": "hello.incn",
    "label": "Typed data",
    "notes": [
      {
        "lineId": "line-hello-2",
        "anchorId": "anchor-hello-0",
        "title": "Named data.",
        "description": "Define data with clear types."
      },
      {
        "lineId": "line-hello-5",
        "anchorId": "anchor-hello-1",
        "title": "Typed functions.",
        "description": "Functions declare their input and output types."
      },
      {
        "lineId": "line-hello-8",
        "anchorId": "anchor-hello-2",
        "title": "Clear structure.",
        "description": "A simple, familiar program structure."
      }
    ],
    "lineCount": 9
  },
  {
    "template": "example-collections",
    "filename": "collections.incn",
    "label": "Collections",
    "notes": [
      {
        "lineId": "line-collections-1",
        "anchorId": "anchor-collections-0",
        "title": "Typed collections.",
        "description": "A list of integers goes in and comes out."
      },
      {
        "lineId": "line-collections-3",
        "anchorId": "anchor-collections-1",
        "title": "Filter and transform.",
        "description": "Keep even numbers and square each one."
      },
      {
        "lineId": "line-collections-7",
        "anchorId": "anchor-collections-2",
        "title": "Reusable functions.",
        "description": "Call the function with ordinary data."
      }
    ],
    "lineCount": 9
  },
  {
    "template": "example-matching",
    "filename": "matching.incn",
    "label": "Pattern matching",
    "notes": [
      {
        "lineId": "line-matching-2",
        "anchorId": "anchor-matching-0",
        "title": "Pattern matching.",
        "description": "Choose a branch from the value."
      },
      {
        "lineId": "line-matching-3",
        "anchorId": "anchor-matching-1",
        "title": "Specific cases.",
        "description": "Handle a known value explicitly."
      },
      {
        "lineId": "line-matching-6",
        "anchorId": "anchor-matching-2",
        "title": "A fallback.",
        "description": "The wildcard handles the remaining values."
      }
    ],
    "lineCount": 9
  },
  {
    "template": "example-enums",
    "filename": "enums.incn",
    "label": "Enums",
    "notes": [
      {
        "lineId": "line-enums-2",
        "anchorId": "anchor-enums-0",
        "title": "Data-bearing variants.",
        "description": "A variant can carry a value with it."
      },
      {
        "lineId": "line-enums-6",
        "anchorId": "anchor-enums-1",
        "title": "Construct a value.",
        "description": "Choose a variant and supply its data."
      },
      {
        "lineId": "line-enums-8",
        "anchorId": "anchor-enums-2",
        "title": "Unpack the variant.",
        "description": "Match the variant to access its text."
      }
    ],
    "lineCount": 11
  },
  {
    "template": "example-optional",
    "filename": "optional.incn",
    "label": "Optional values",
    "notes": [
      {
        "lineId": "line-optional-1",
        "anchorId": "anchor-optional-0",
        "title": "Explicit absence.",
        "description": "Option describes a value that may be missing."
      },
      {
        "lineId": "line-optional-3",
        "anchorId": "anchor-optional-1",
        "title": "A present value.",
        "description": "Some carries the name into this branch."
      },
      {
        "lineId": "line-optional-5",
        "anchorId": "anchor-optional-2",
        "title": "Handle absence.",
        "description": "None has its own path and greeting."
      }
    ],
    "lineCount": 9
  },
  {
    "template": "example-results",
    "filename": "results.incn",
    "label": "Error handling",
    "notes": [
      {
        "lineId": "line-results-1",
        "anchorId": "anchor-results-0",
        "title": "Explicit outcomes.",
        "description": "Result declares success and error types."
      },
      {
        "lineId": "line-results-3",
        "anchorId": "anchor-results-1",
        "title": "Return an error.",
        "description": "Invalid input gets a meaningful error value."
      },
      {
        "lineId": "line-results-8",
        "anchorId": "anchor-results-2",
        "title": "Handle both paths.",
        "description": "Match success or error at the call site."
      }
    ],
    "lineCount": 11
  }
];
