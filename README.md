# Tilelive Switch
A tilelive module that's intended to be used to assist in production switch between two different tile sources.

It's features includes:
- Mirroring of `getTile` requests to a secondary source in order to simulate production traffic in the new source without affecting output.
    - For the primary source it will act as no-op middleware

## Requirements
- Node.js 10+

## Kartotherian configuration
This module was created with Kartotherian in mind, and you can configure the source using the following parameters:

```yaml
# Mirror requests to a secondary source
switch:
  uri: switch://
  params:
    source: { ref: tmsource }
    mirror: { ref: tegola }
```