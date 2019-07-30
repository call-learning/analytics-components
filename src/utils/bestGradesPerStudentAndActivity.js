import { least, rollup } from 'd3-array';

/**
 * From a list of grades, get the best grade for each student and return a filtered list of grades
 */
export default grades => rollup(
  grades,
  gvs => least(gvs, g => -g.value), // We take the max grade per student here
  g => g.activityid, // First is the activity type
  g => g.studentid, // Secondly  index is by studentid
);

