import React, { Fragment } from 'react'
import { Form, Table, Input, Checkbox, Select, InputNumber, Button } from 'antd'
import styled from 'styled-components'
import { FormInstance, FormItemProps } from 'antd/lib/form'
import { SelectProps, SelectValue } from 'antd/lib/select'
import { InputProps } from 'antd/lib/input'
import { CheckboxProps } from 'antd/lib/checkbox'
import { ColumnType, TableProps } from 'antd/lib/table'
import Column from 'antd/lib/table/Column'
import { InternalNamePath } from 'antd/lib/form/interface'
import { FormListFieldData, FormListOperation } from 'antd/lib/form/FormList'
import { isArray } from 'lodash'

const StyledInput = styled(Input)`
	border-color: transparent;
	background: transparent;
`

const StyledSelect = styled(Select)`
	&& .ant-select-selector {
		border-color: transparent;
		background: transparent;
	}
`

interface AutoInputProps {
	value: any
}

function AutoInput({ value }: AutoInputProps) {
	if (typeof value === 'number') {
		return <InputNumber />
	}

	if (typeof value === 'boolean') {
		return <Checkbox />
	}

	return <Input />
}

const StyledFormItem = styled(Form.Item)`
	margin: 0;
`

type InputType = 'input' | 'select' | 'checkbox' | 'static'

function makeOnCell(pInputType?: InputType, pIsHidden?: boolean) {
	if (pIsHidden) {
		return () => ({
			style: { display: 'none' },
		})
	}

	if (pInputType === 'input') {
		return () => ({
			style: { padding: '16px 5px' },
		})
	}

	if (pInputType === 'select') {
		return () => ({
			style: { padding: '16px 5px' },
		})
	}
}

function makeOnHeaderCell(pIsHidden?: boolean) {
	if (pIsHidden) {
		return () => ({
			style: { display: 'none' },
		})
	}
}

interface MakeRenderOptions {
	inputType?: InputType
	dataIndex: string | string[]
	formItemProps?: FormItemProps
	inputProps?: Record<string, any>
	onStatic?: (text: any) => any
}

function makeRender<RecordType>({
	inputType,
	dataIndex,
	formItemProps,
	inputProps,
	onStatic,
}: MakeRenderOptions) {
	if (inputType === 'input') {
		return (pText: any, pRecord: RecordType, pIndex: number) => {
			return (
				<StyledFormItem
					name={([pIndex] as InternalNamePath).concat(dataIndex)}
					{...formItemProps}
				>
					<StyledInput {...(inputProps as InputProps)} />
				</StyledFormItem>
			)
		}
	}

	if (inputType === 'select') {
		return (pText: any, RecordType: RecordType, pIndex: number) => (
			<StyledFormItem
				name={([pIndex] as InternalNamePath).concat(dataIndex)}
				{...formItemProps}
			>
				<StyledSelect {...(inputProps as SelectProps<SelectValue>)} />
			</StyledFormItem>
		)
	}

	if (inputType === 'checkbox') {
		return (pText: any, pRecord: RecordType, pIndex: number) => (
			<StyledFormItem
				name={([pIndex] as InternalNamePath).concat(dataIndex)}
				valuePropName='checked'
				{...formItemProps}
			>
				<Checkbox {...(inputProps as CheckboxProps)} />
			</StyledFormItem>
		)
	}

	// Default: pInputType === 'static'
	return (pText: any, pRecord: RecordType, pIndex: number) => (
		<Fragment>
			<StyledFormItem
				name={([pIndex] as InternalNamePath).concat(dataIndex)}
				style={{ display: 'none' }}
				{...formItemProps}
			>
				<AutoInput value={pText} />
			</StyledFormItem>
			{onStatic ? onStatic(pText) : pText}
		</Fragment>
	)
}

export interface FormTableColumn<RecordType = any>
	extends ColumnType<RecordType> {
	inputType?: InputType
	hidden?: boolean
	dataIndex: string | string[]
	formItemProps?: FormItemProps
	inputProps?: Record<string, any>
	onStatic?: (text: any) => any
}

function transformColumns<RecordType>(
	pColumns: FormTableColumn<RecordType>[] | ColumnsFactory<RecordType> = [],
	pFields: FormListFieldData[],
	pOperation: FormListOperation,
	pMeta: {
		errors: React.ReactNode[]
	}
) {
	const columns = isArray(pColumns)
		? pColumns
		: pColumns(pFields, pOperation, pMeta)

	return columns.map(
		({
			inputType,
			hidden,
			dataIndex,
			key,
			formItemProps,
			inputProps,
			onStatic,
			...rest
		}) => ({
			dataIndex,
			key: key || JSON.stringify(dataIndex),
			onCell: makeOnCell(inputType, hidden),
			onHeaderCell: makeOnHeaderCell(hidden),
			render: makeRender({
				inputType,
				dataIndex,
				formItemProps,
				inputProps,
				onStatic,
			}),
			...rest,
		})
	)
}

type ColumnsFactory<RecordType> = (
	pFields: FormListFieldData[],
	pOperation: FormListOperation,
	pMeta: {
		errors: React.ReactNode[]
	}
) => FormTableColumn<RecordType>[]

interface FormTableProps<RecordType> {
	columns?: FormTableColumn<RecordType>[] | ColumnsFactory<RecordType>
	form: FormInstance
	listNamePath: string | number | (string | number)[]
	tableProps?: TableProps<RecordType>
}

function FormTable<RecordType extends object = any>({
	form,
	columns,
	listNamePath,
	tableProps = {},
}: FormTableProps<RecordType>) {
	return (
		<Form.List name={listNamePath}>
			{(pFields, pOperation, pMeta) => {
				const transformedColumns = transformColumns(columns, pFields, pOperation, pMeta)

				return (
					<Fragment>
						<Table
							dataSource={form.getFieldValue(listNamePath)}
							{...tableProps}
						>
							{transformedColumns.map((pColumn) => (
								<Column {...pColumn} />
							))}
						</Table>
						<Button onClick={() => pOperation.add()}>Add</Button>
					</Fragment>
				)
			}}
		</Form.List>
	)
}

export default FormTable
