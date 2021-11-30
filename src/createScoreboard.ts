export interface TeamRecord {
  /** Matches Played */
  MP: number
  /** Matches Won */
  W: number
  /** Matches Drawn (Tied) */
  D: number
  /** Matches Lost */
  L: number
}

export interface TeamRecordTableItem extends TeamRecord {
  Name: string
  /** Points */
  P: number
}

export type MatchResult = 'win' | 'draw' | 'loss'

export function resultValid(result: string): result is MatchResult {
  return result === 'win' || result === 'draw' || result === 'loss'
}

export function formatMsgs(msgs: string): Array<[string, string, MatchResult]> {
  const dataArr = msgs.trim().split('\n')
  const result: Array<[string, string, MatchResult]> = []
  dataArr.forEach((data) => {
    const msgs = data.split(';').map((d) => d.trim())
    const [teamA, teamB, matchResult] = msgs
    if (teamA && teamB && resultValid(matchResult)) {
      result.push([teamA, teamB, matchResult])
    }
  })
  return result
}

export function sortStr(a: string, b: string) {
  let i = 0
  while (a[i] && b[i]) {
    const charCodeA = a[i].charCodeAt(0)
    const charCodeB = b[i].charCodeAt(0)
    if (charCodeA < charCodeB) {
      return -1
    }
    if (charCodeA > charCodeB) {
      return 1
    }
    i++
  }
  return 0
}

export function createScoreboard() {
  const teamDataMap: Record<string, TeamRecord> = {}

  const ensureTeam = (teamName: string) => {
    if (!teamDataMap[teamName]) {
      teamDataMap[teamName] = {
        MP: 0,
        W: 0,
        D: 0,
        L: 0,
      }
    }
    return teamDataMap[teamName]
  }
  const instance = {
    record(msgs: string) {
      const results = formatMsgs(msgs)
      results.forEach((data) => {
        const [teamA, teamB, matchResult] = data
        const teamARecord = ensureTeam(teamA)
        const teamBRecord = ensureTeam(teamB)
        teamARecord.MP++
        teamBRecord.MP++
        if (matchResult === 'win') {
          teamARecord.W++
          teamBRecord.L++
        } else if (matchResult === 'loss') {
          teamBRecord.W++
          teamARecord.L++
        } else {
          teamARecord.D++
          teamBRecord.D++
        }
      })
    },
    output() {
      return teamDataMap
    },
    log() {
      console.table(instance.sortRecords(), ['Name', 'MP', 'D', 'L', 'P'])
    },
    sortRecords(dataMap?: Record<string, TeamRecord>) {
      const innerDataMap = dataMap || teamDataMap
      const rows: TeamRecordTableItem[] = Object.keys(innerDataMap).map((teamName) => {
        const teamRecord = innerDataMap[teamName]
        const P = teamRecord.W * 3 + teamRecord.D
        return {
          Name: teamName,
          ...teamRecord,
          P,
        }
      })
      return rows.sort((a, b) => {
        const r = a.P - b.P
        if (r > 0) {
          return -1
        }
        if (r < 0) {
          return 1
        }
        return sortStr(a.Name, b.Name)
      })
    },
  }

  return instance
}
