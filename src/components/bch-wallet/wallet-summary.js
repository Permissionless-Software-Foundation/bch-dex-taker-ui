/*
  This component displays a summary of the wallet.
*/

// Global npm libraries
import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
// import { Clipboard } from '@capacitor/clipboard'

// Local libraries
import './wallet-summary.css'
import CopyOnClick from './copy-on-click'

let _this

class WalletSummary extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      bchWallet: props.appData.bchWallet,
      bchWalletState: props.appData.bchWalletState,
      appData: props.appData,
      blurredMnemonic: true,
      blurredPrivateKey: true,

      // DEX holding wallet.
      index1BlurredWif: true
    }

    _this = this
  }

  async componentDidMount () {
    // Get the keypair that holds Counter Offer UTXOs.
    const bchDexLib = this.state.appData.dex
    const keyPair = await bchDexLib.take.util.getKeyPair(1)
    // console.log('keyPair: ', keyPair)

    // Update the app data with the info.
    const newAppData = this.state.appData
    newAppData.index1Addr = keyPair.cashAddress
    newAppData.index1Wif = keyPair.wif
    this.setState({
      appData: newAppData
    })
  }

  render () {
    // console.log(`WalletSummary render() this.state.bchWalletState: ${JSON.stringify(this.state.bchWalletState, null, 2)}`)

    const eyeIcon = {
      mnemonic: _this.state.blurredMnemonic ? faEyeSlash : faEye,
      privateKey: _this.state.blurredPrivateKey ? faEyeSlash : faEye,
      index1Wif: _this.state.index1BlurredWif ? faEyeSlash : faEye
    }

    return (
      <>
        <Container>
          <Row>
            <Col>
              <Card>
                <Card.Body>
                  <Card.Title style={{ textAlign: 'center' }}>
                    <h2>
                      <FontAwesomeIcon icon={faWallet} />{' '}
                      <span>My Wallet</span>
                    </h2>
                  </Card.Title>
                  <Container>
                    <Row style={{ padding: '25px' }}>
                      <Col xs={12} sm={10} lg={8} style={{ padding: '10px' }}>
                        <b>Mnemonic:</b> <span className={this.state.blurredMnemonic ? 'blurred' : null}>{this.state.bchWalletState.mnemonic}</span>
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={eyeIcon.mnemonic} size='lg' onClick={() => _this.toggleMnemonicBlur()} />
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <CopyOnClick walletProp='mnemonic' appData={this.state.appData} />
                      </Col>
                    </Row>

                    <Row style={{ padding: '25px', backgroundColor: '#eee' }}>
                      <Col xs={12} sm={10} lg={8} style={{ padding: '10px' }}>
                        <b>Private Key:</b> <span className={this.state.blurredPrivateKey ? 'blurred' : null}>{this.state.bchWalletState.privateKey}</span>
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={eyeIcon.privateKey} size='lg' onClick={() => _this.togglePrivateKeyBlur()} />
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <CopyOnClick walletProp='privateKey' appData={this.state.appData} />
                      </Col>
                    </Row>

                    <Row style={{ padding: '25px' }}>
                      <Col xs={12} sm={10} lg={8} style={{ padding: '10px' }}>
                        <b>Cash Address:</b> {this.state.bchWalletState.cashAddress}
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }} />
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <CopyOnClick walletProp='cashAddress' appData={this.state.appData} />
                      </Col>
                    </Row>

                    <Row style={{ padding: '25px', backgroundColor: '#eee' }}>
                      <Col xs={12} sm={10} lg={8} style={{ padding: '10px' }}>
                        <b>SLP Address:</b> {this.state.bchWalletState.slpAddress}
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }} />
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <CopyOnClick walletProp='slpAddress' appData={this.state.appData} />
                      </Col>
                    </Row>

                    <Row style={{ padding: '25px' }}>
                      <Col xs={12} sm={10} lg={8} style={{ padding: '10px' }}>
                        <b>Legacy Address:</b> {this.state.bchWalletState.legacyAddress}
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }} />
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <CopyOnClick walletProp='legacyAddress' appData={this.state.appData} />
                      </Col>
                    </Row>

                    <Row style={{ padding: '25px', backgroundColor: '#eee' }}>
                      <Col xs={10} sm={10} lg={8} style={{ padding: '10px' }}>
                        <b>HD Path:</b> {this.state.bchWalletState.hdPath}
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }} />
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <CopyOnClick walletProp='hdPath' appData={this.state.appData} />
                      </Col>
                    </Row>

                    <Row style={{ padding: '25px' }}>
                      <Col xs={12} sm={10} lg={8} style={{ padding: '10px' }}>
                        <b>DEX Holding Address:</b> {this.state.appData.index1Addr}
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }} />
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <CopyOnClick walletProp='index1Addr' appData={this.state.appData} />
                      </Col>
                    </Row>

                    <Row style={{ padding: '25px', backgroundColor: '#eee' }}>
                      <Col xs={12} sm={10} lg={8} style={{ padding: '10px' }}>
                        <b>DEX Holding WIF:</b> <span className={this.state.index1BlurredWif ? 'blurred' : null}>{this.state.appData.index1Wif}</span>
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <FontAwesomeIcon icon={eyeIcon.index1Wif} size='lg' onClick={() => _this.toggleDexKeyBlur()} />
                      </Col>
                      <Col xs={6} sm={1} lg={2} style={{ textAlign: 'center' }}>
                        <CopyOnClick walletProp='index1Wif' appData={this.state.appData} />
                      </Col>
                    </Row>

                  </Container>
                </Card.Body>
              </Card>

            </Col>
          </Row>
        </Container>
      </>
    )
  }

  toggleMnemonicBlur () {
    this.setState({
      blurredMnemonic: !_this.state.blurredMnemonic
    })
  }

  togglePrivateKeyBlur () {
    this.setState({
      blurredPrivateKey: !_this.state.blurredPrivateKey
    })
  }

  toggleDexKeyBlur () {
    this.setState({
      index1BlurredWif: !_this.state.index1BlurredWif
    })
  }

  // async copyToClipboard (key) {
  //   // console.log('copyToClipboard() key: ', key)
  //
  //   let val = _this.state.bchWalletState[key]
  //   // console.log(`value copied to clipboard: ${val}`)
  //
  //   if (key.includes('index1Addr')) {
  //     val = _this.state.index1Addr
  //   }
  //
  //   try {
  //     // Capacitor Android environment.
  //
  //     // Write the value to the clipboard.
  //     await Clipboard.write({
  //       string: val
  //     })
  //   } catch (err) {
  //     // Browser environment. Use normal browser methods.
  //
  //     const textArea = document.createElement('textarea')
  //     textArea.value = val
  //     document.body.appendChild(textArea)
  //     textArea.select()
  //     document.execCommand('Copy')
  //     textArea.remove()
  //   }
  // }
}

export default WalletSummary
