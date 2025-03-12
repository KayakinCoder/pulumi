import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

// testing creating an s3 bucket
const example = new aws.s3.BucketV2("example", {
  bucket: "test-bucket-pulumi-186354154",
});
