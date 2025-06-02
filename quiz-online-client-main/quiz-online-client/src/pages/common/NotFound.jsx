import {Link} from 'react-router-dom';
import {Button, Result} from 'antd';

function NotFound() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 'calc(100vh - 64px)', // Minus Navbar height
            backgroundColor: '#f0f2f5',
        }}>
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link to="/">
                        <Button type="primary">
                            Back to Home
                        </Button>
                    </Link>
                }
            />
        </div>
    );
}

export default NotFound;