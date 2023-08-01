// uuid

import {
  ConfigRows,
  ConfigRowsSkeleton,
  SessionConfig,
  SessionConfigSkeleton,
  SessionProfile,
  SessionProfileSkeleton,
  Jobs,
  ConfigNames
} from "./utils";
let id = 0;

export type ProcessSkeleton = {
  _device: { id: string, name: string, process: { username: string, configFile: string } | null, battery: string, },
  _scheduled: string | false
  _battery: string,
  _result: string,
  _config: SessionConfig,
  _total_crashes: number,
  _user: {
    username: string,
    membership: "PREMIUM" | "FREE",
  },
  _status: "RUNNING" | "WAITING" | "STOPPED" | "FINISHED",
  _total: number;
  _following: number;
  _followers: number;
  _session: ConfigRowsSkeleton;
  _profile: SessionProfile;
  _jobs: Jobs;
  _configFile: ConfigNames;
  _startTime: number;


}
export class Process {
  private _device: { id: string, name: string, process: { username: string, configFile: string } | null, battery: string };
  private _scheduled: false | string;
  private _battery: string;
  private _result: string;
  private _total: number;
  private _followers: number;
  private _following: number;
  private _session: ConfigRowsSkeleton;
  private _total_crashes: number = 0;
  private _user: {
    username: string,
    membership: "PREMIUM" | "FREE",
  };
  private _status: "RUNNING" | "WAITING" | "STOPPED" | "FINISHED";
  private _config: SessionConfig;
  private _profile: SessionProfile;
  private _jobs: Jobs = ['follow'];
  private _configFile: ConfigNames = "config.yml";
  private _startTime: number;

  constructor(
    device: { id: string, name: string, battery: string },
    username: string,
    membership: "PREMIUM" | "FREE",
    status: "RUNNING" | "WAITING" | "STOPPED" | "FINISHED",
    result: string, total: number,
    following: number = 0,
    followers: number = 0,
    session: ConfigRowsSkeleton,
    config: SessionConfig = SessionConfigSkeleton,
    profile: SessionProfile = SessionProfileSkeleton,
    _total_crashes: number = 0,
    _scheduled: false | string = false,
    _battery: string,
    _jobsThisSession: Jobs = ['follow'],
    _configFile: ConfigNames = "config.yml",
    _startTime: number = Date.now()
  ) {
    this._user = {
      username,
      membership
    }
    this._device = { id: device.id, name: device.name, battery: device.battery, process: { username: this.username, configFile: this.configFile } };
    this._status = status;
    this._result = result;
    this._total = total;
    this._followers = followers;
    this._following = following;
    this._config = config;
    this._total_crashes = _total_crashes ? _total_crashes : 0;
    this._profile = profile;
    this._session = session ? session : ConfigRows;
    this._scheduled = _scheduled;
    this._battery = _battery;
    this._jobs = _jobsThisSession;
    this._configFile = _configFile;
    this._startTime = _startTime;
    id++;
  }

  get device() {
    return this._device;
  }
  set device(device: { id: string, name: string, battery: string }) {

    this._device = { id: device.id, name: device.name, battery: device.battery, process: { username: this.username, configFile: this.configFile } };
    return;
  }

  get configFile() {
    return this._configFile;
  }

  set configFile(configFile: ConfigNames) {
    this._configFile = configFile;
    return;
  }

  get startTime() {
    return this._startTime;
  }

  set startTime(_startTime: number) {
    this._startTime = _startTime ? _startTime : Date.now();
    return;
  }

  get jobs() {
    return this._jobs;
  }
  set jobs(newJobs: Jobs) {
    this._jobs = newJobs;
    return;
  }

  get battery() {
    return this._battery;
  }

  set battery(battery: string) {
    this._battery = battery;
    return;
  }

  get total_crashes() {
    return this._total_crashes;
  }

  set total_crashes(total_crashes: number) {
    this._total_crashes = total_crashes;
    return;
  }

  get profile() {
    return this._profile;
  }

  set profile(profile: SessionProfile) {
    this._profile = profile;
    return;
  }

  get config() {
    return this._config;
  }

  set config(config: SessionConfig) {
    this._config = config;
    return;
  }

  get session() {
    return this._session;
  }
  set session(session: ConfigRowsSkeleton) {
    this._session = session;
    return;
  }

  get scheduled() {
    return this._scheduled;
  }
  set scheduled(scheduled: false | string) {
    this._scheduled = scheduled;
  }

  get following() {
    return this._following;
  }
  set following(following: number) {
    this._following = following;
    return;
  }

  get followers() {
    return this._followers;
  }
  set followers(followers: number) {
    this._followers = followers;
    return;
  }

  get total() {
    return this._total;
  }
  set total(total: number) {
    this._total = total;
    return;
  }
  get user() {
    return this._user;
  }
  set user(user: { username: string, membership: "PREMIUM" | "FREE" }) {
    this._user = user;
    return;
  }

  get username() {
    return this._user.username;
  }
  set username(username: string) {
    this._user.username = username;
    return;
  }

  get membership() {
    return this._user.membership;
  }
  set membership(membership: "PREMIUM" | "FREE") {
    this._user.membership = membership;
    return;
  }


  get status() {
    return this._status;
  }
  set status(status: "RUNNING" | "WAITING" | "STOPPED" | "FINISHED") {
    this._status = status;
    return;
  }

  get result() {
    return this._result;
  }
  set result(result: string) {
    this._result = result;
    return;
  }
}
