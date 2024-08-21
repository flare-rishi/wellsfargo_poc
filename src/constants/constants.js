//routes

export const URL = "http://127.0.0.1:8080";
export const WAREHOUSE = "wareHouse";
export const DATASETNAME = "dataSetName";
export const DOMAINNAME = "domainName";
export const TABLENAME = "tableName";
export const DAG = "dagName";

export const WAREHOUSELOGO = "../assets/data-warehouse.png";
export const DOMAIN = "domain";
export const DATASET = "dataset";
export const EXCLUDEBREADCRUMBS = ["", "jobs", "data", "access"];

export const TAGS = "Tags";
export const DATASETKEY = "Dataset";
export const LOCATION = "Location";
export const CONTACT = "Contact";
export const DESCRIPTION = "Description";
export const TABLE = "Table";
export const OWNER = "Owner";
export const STATUS = "Status";

export const ACTIVE = "active";
export const AVATAR = "avatar";
export const NONE = "none";

export const SUCCESS = "success";
export const ERROR = "error";

export const REPLACEROUTES = ["access", "jobs"];
export const DATA = "data";
export const GRID = "grid";
export const LIST = "list";

export const JOBS = "Jobs";
export const DOMAINLEVELTABS = [DATASET, JOBS];

export const DATASETFILTERS = [DATASETKEY, CONTACT, DESCRIPTION, LOCATION];
export const TABLELEVELFILTERS = [TABLE, OWNER, DESCRIPTION, TAGS, LOCATION];
export const DOMIANLEVELSIDEBAR = [DATASET, JOBS];

//table level
export const VIEWTYPETABLLE = "viewTypeTable";
export const RELATED = "Related";
export const EXPLORE = "Explore";
export const LINEAGE = "Lineage";
export const ADJUSTMENTS = "Adjustments";
export const BRANCHNAME = "branchName";
export const VERSIONDATE = "VersionDate";
export const FILESIZE = "fileSize";
export const ADDEDCOLUMN = "Added";
export const REMOVEDCOLUMN = "Removed";
export const OVERVIEW = "Overview";
export const GENERATIONS = "Generation";
export const UPDATED = "Updated";
export const PROJECTS = "projects";
export const DATACONTRACT = "data contract";
export const ACLS = "ACLs";
export const ICONSIZE = 16;
export const MUIBUTTONSTYLING = {
    textTransform: "none",
    backgroundColor: "rgba(255, 245, 220, 1)",
    color: "rgba(165, 121, 10, 1)",
    padding: "0px 0px",
    borderRadius: "10px",
    fontFamily: "Roboto",
    fontSize: "10px",
    fontWeight: "400",
    verticalAlign: "middle",
};

export const TABLELEVELTABS = [ADJUSTMENTS, EXPLORE];

//projects

export const VIEWTYPEPROJECT = "project";

export const VIEWTYPEJOB = "viewTypeJob";
export const JOBVIEWTYPETABLE = "table";

//  mui variants

export const OUTLINED = "outlined";
export const STANDARD = "standard";
export const FILLED = "filled";
export const CONTAINED = "contained";
export const TEXT = "text";

//size of comp in mui
export const SMALL = "small";
export const MEDIUM = "medium";
export const LARGE = "large";
export const RECORD = "Records";
export const QUALITYMETRICS = "Quality Metrics";
export const JOBSTATUS = "Job status";

//

///NA
export const NA = "N/A";

// record
export const PREVIOUSCOUNT = "previousCount";
export const NEXTCOUNT = "nextCount";
export const CURRENTCOUNT = "currentCount";

export const PREVIOUSDIFF = "previousDiff";
export const NEXTDIFF = "nextDiff";

//versionID and forkId

export const VERSIONID = "versionId";
export const FORKID = "forkId";

//rows

export const ROWS = "rows";

//Quality metrics thresholds and colors
export const NOTACCEPTABLETHRESHOLD = 75;
export const ACCEPTABLETHRESHOLD = 85;
export const RED_QM = "#f58478";
export const YELLOW_QM = "#f5e85d";
export const GREEN_QM = "#bff0a5";

export const PASSPHRASE = process.env.REACT_PASSPHRASE;

//Access policies
export const PIIVISIBILITY = "pii_visibility";

export const INTERTOWER = "inter-tower";
export const MEMBEROF = "member_of";
export const FILTER = "filter";
export const MASKS = "masks";
export const PII = "pii";
export const TOWERS = "towers";
export const VERSIONS = "version";

//for frontend perspective only
export const INTERPARENTS = "inter";
export const NAME = "name";
export const PREEDIT = "preEdit";

export const EDITME = "--EDIT-ME--";
export const CHILDS = "childs";
export const PARENTS = "parents";

export const UNLAYEREDCHILDS = "unlayered_childs";
export const TOWERID = "towerId";

export const LAYER1 = "1";
export const LAYER = "";
export const LASTIDUSED = "last_id_used";
//
//
//

// string

export const STRING = "string";

//api-end-points

export const APIBASEPATH = "tablefullpath";
export const APIFORKDETAILS = "fetchforkinfo";

export const APITABLEMETADATA = "tablemetadata";
export const APIRECORDS = "records";
export const APISCHEMA = "schema";
export const APIQUALITY = "qualitymetrics";
export const APIADJUSTMENTS = "adjustments";
export const APIEXPLORE = "explore";
export const VERSIONISVALID = "isValid";
export const LASTFETCHED = "lastFetched";
export const FETCH_ACLS = "fetchacls";

export const NOOFROWS = 10;

export const TEMP_USER_GROUP = "Banking:admin";

export const DASH = "--";

export const LATEST = "latest";

export const RESPONSE = "response";
export const RESPONSEMESSAGE = "message";
export const RESPONSESTATUS = "status";
export const VERSIONNOTFOUND = "version not found";
export const TABLENOTFOUND = "table not found";
export const ERROR400 = 400;

export const UPDATEGRAPH = "graph is not updated ";
//for fork form
export const TITLE = "name";
export const COLUMNS = "columns"; // redux state variables

export const COLUMNNAMES = "column_names";

export const TABLE_METADATA = "tableMetaData";
export const TABLE_VERSION_DATA = "tableVersionData";
export const TABLE_ADJUSTMENTS = "tableAdjustments";
export const QUALITY_METRICS_DATA = "qualityMetricsData";
export const RECORDS_COUNT_DATA = "recordsCountData";
export const TABLE_SCHEMA = "tableSchema";
export const EXPLORE_DATA = "exploreData";
export const VERSION_IS_VALID = "versionIsValid";
export const LATEST_VERSION = "latest_version";
export const ACLS_DATA_JSON = "aclDataJson";
export const FORKMODALDATA = "forkModalData";
export const TABLEPATH = "tablePath";

export const TABLE_PATH_RESPONSE = "path";
export const FORKDETAILRESPONSE = "forkdetail";
export const ADJUSTMENTS_RESPONSE = "adjustments";
export const SCHEMA_RESPONSE = "schema";
export const TABLE_METADATA_RESPONSE = "tablemetadata";
export const METRICS_RESPONSE = "metrics";
export const ROWS_RESPONSE = "rows";
export const EXPLORE_RESPONSE = "explore";
export const ACLS_RESPONSE = "acls";

//
//
export const USER = "user";
export const APIDAG = "dags";
export const APIJOB = "jobs";

export const PATH = "path";
export const DAGNAME = "name";

export const MAX_ENTRIES = 10;
export const TIME_LIMIT = 60 * 60 * 1000; // 2 minutes in milliseconds

export const NO_DATA = "no data to display";
export const SOMETHING_WENT_WRONG = "something went wrong";
