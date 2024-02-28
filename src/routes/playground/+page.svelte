<script lang="ts">
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  let value: number = 0;
</script>

<RadioGroup>
  <RadioItem bind:group={value} name="justify" value={0}>(label)</RadioItem>
  <RadioItem bind:group={value} name="justify" value={1}>(label)</RadioItem>
  <RadioItem bind:group={value} name="justify" value={2}>(label)</RadioItem>
</RadioGroup>
