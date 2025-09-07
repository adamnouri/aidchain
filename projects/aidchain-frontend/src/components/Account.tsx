import { useWallet } from '@txnlab/use-wallet-react'
import { useMemo } from 'react'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

const Account = () => {
  const { activeAddress } = useWallet()
  const algoConfig = getAlgodConfigFromViteEnvironment()

  const networkName = useMemo(() => {
    return algoConfig.network === '' ? 'localnet' : algoConfig.network.toLocaleLowerCase()
  }, [algoConfig.network])

  const styles = {
    container: {
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.375rem',
      marginBottom: '1rem'
    },
    link: {
      fontSize: '1.125rem',
      color: '#2563eb',
      textDecoration: 'none',
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: '500'
    },
    network: {
      fontSize: '1.125rem',
      color: '#374151',
      fontWeight: '500'
    }
  }

  return (
    <div style={styles.container}>
      <a 
        style={styles.link}
        target="_blank" 
        href={`https://lora.algokit.io/${networkName}/account/${activeAddress}/`}
        onMouseOver={(e) => e.currentTarget.style.textDecoration = 'underline'}
        onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
      >
        Address: {ellipseAddress(activeAddress)}
      </a>
      <div style={styles.network}>Network: {networkName}</div>
    </div>
  )
}

export default Account
