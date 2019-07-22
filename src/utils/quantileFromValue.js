export default function (value, quantileList) {
  return Array.from(quantileList)
    .reduceRight(
      (acc, current) => (Number.parseFloat(value) <= current) ? current : acc);
}
