# Tilelive Switch
A tilelive module that's intended to be used to assist in production switch between two different tile sources.

It's features includes:
- Mirroring of `getTile` requests to a secondary source in order to simulate production traffic in the new source without affecting output.
  - For the primary source it will act as no-op middleware
- Switch the response output with the secondery source `getTile` response to in order to switch production traffic to the new source slowly.
  - This is only useful if both sources output the same content

## Requirements
- Node.js 10+

## Kartotherian configuration
This module was created with Kartotherian in mind, and you can configure the source using the following parameters:

### Enable load mirroring
```yaml
# Switch requests to a secondary source
switch:
  uri: mirror://
  params:
    source: { ref: tm2source }
    secondarySource: { ref: tegola }
    enableMirror: true
    loadBalancer:
      bucketSize: 1000 # milliseconds
      totalBuckets: 10 # number of buckets in the histogram
      threshold: 0.1 # 10% of load to the mirrored source
```

### Enable load switch
```yaml
# Switch requests to a secondary source
switch:
  uri: switch://
  params:
    source: { ref: tm2source }
    secondarySource: { ref: tegola }
    enableSwitch: true
    loadBalancer:
      bucketSize: 1000 # milliseconds
      totalBuckets: 10 # number of buckets in the histogram
      threshold: 0.1 # 10% of secondary source load will be returned in the responses
```
