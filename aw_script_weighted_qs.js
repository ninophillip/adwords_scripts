function main() {
  var SPREADSHEET_URL = "INSERT SPREADSHEET URL";
  var SHEET_NAME = 'QS US EN BK';
  var today = new Date();
  var date_str = [today.getFullYear(),(today.getMonth() + 1),today.getDate()].join("-");
   
  var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
  var qs_sheet = spreadsheet.getSheetByName(SHEET_NAME);

  var kw_iter = AdWordsApp.keywords()
    .withCondition("Status = ENABLED")
    .withCondition("CampaignName CONTAINS 'INSERT UNIQUE CAMPAIGN IDENTIFIER'")
    .forDateRange("LAST_30_DAYS")
    .withCondition("Impressions > 0")
    .orderBy("Impressions DESC")
    .withLimit(50000)
    .get();

  var tot_imps_weighted_qs = 0;
  var tot_imps = 0;
  var tot_cl_weighted_qs = 0;
  var tot_clicks = 0;

  while(kw_iter.hasNext()) {
    var kw = kw_iter.next();
    var kw_stats = kw.getStatsFor("LAST_30_DAYS");
    var imps = kw_stats.getImpressions();
    var clicks = kw_stats.getClicks();
    var qs = kw.getQualityScore();
    tot_imps_weighted_qs += (qs * imps);
    tot_cl_weighted_qs += (qs * clicks);
    tot_imps += imps;
    tot_clicks += clicks;
  }

  var imp_acct_qs = tot_imps_weighted_qs / tot_imps;
  var cl_acct_qs = tot_cl_weighted_qs / tot_clicks;

  qs_sheet.appendRow([date_str,imp_acct_qs,cl_acct_qs]);
}
