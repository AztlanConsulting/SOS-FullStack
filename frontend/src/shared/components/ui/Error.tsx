interface Props {
  title: string;
  message: string;
}

const Error = ({ title, message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <h3 className="text-2xl font-semibold text-slate-900">{title}</h3>

      <p className="mt-2 max-w-sm text-slate-500">{message}</p>
    </div>
  );
};

export default Error;
