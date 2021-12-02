import React from 'react'

import { gql } from '@apollo/client'

import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Chip from '@material-ui/core/Chip'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { ConfirmationDialog } from 'src/components/Dialogs/ConfirmationDialog'
import { OCRKeyBundleRow } from './OCRKeyBundleRow'
import { ErrorRow, LoadingRow, NoContentRow } from './Rows'

export const OCR_KEY_BUNDLES_PAYLOAD__RESULTS_FIELDS = gql`
  fragment OCRKeyBundlesPayload_ResultsFields on OCRKeyBundle {
    id
    configPublicKey
    offChainPublicKey
    onChainSigningAddress
  }
`

const styles = () => {
  return createStyles({
    cardContent: {
      padding: 0,
      '&:last-child': {
        padding: 0,
      },
    },
  })
}

export interface Props extends WithStyles<typeof styles> {
  loading: boolean
  data?: FetchOcrKeyBundles
  errorMsg?: string
  onCreate: () => void
  onDelete: (id: string) => Promise<any>
}

export const OCRKeysCard = withStyles(styles)(
  ({ classes, data, errorMsg, loading, onCreate, onDelete }: Props) => {
    const [confirmDeleteID, setConfirmDeleteID] = React.useState<string | null>(
      null,
    )

    return (
      <>
        <Card>
          <CardHeader
            action={
              <Button variant="outlined" color="primary" onClick={onCreate}>
                New OCR Key
              </Button>
            }
            title="Off-Chain Reporting Keys"
            subheader="Manage your Off-Chain Reporting Key Bundles"
          />
          <CardContent className={classes.cardContent}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Key Bundle</TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <LoadingRow visible={loading} />
                <NoContentRow
                  visible={data?.ocrKeyBundles.results?.length === 0}
                />
                <ErrorRow msg={errorMsg} />

                {data?.ocrKeyBundles.results?.map((bundle, idx) => (
                  <OCRKeyBundleRow
                    bundle={bundle}
                    key={idx}
                    onDelete={() => setConfirmDeleteID(bundle.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ConfirmationDialog
          open={!!confirmDeleteID}
          maxWidth={false}
          title="Delete OCR Key Bundle"
          body={<Chip label={confirmDeleteID} />}
          confirmButtonText="Confirm"
          onConfirm={async () => {
            if (confirmDeleteID) {
              await onDelete(confirmDeleteID)
              setConfirmDeleteID(null)
            }
          }}
          cancelButtonText="Cancel"
          onCancel={() => setConfirmDeleteID(null)}
        />
      </>
    )
  },
)